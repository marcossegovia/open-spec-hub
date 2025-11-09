/**
 * AsyncAPI Parser
 *
 * Parses and validates AsyncAPI 2.x/3.x specifications
 */

import { Parser } from '@asyncapi/parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';

export type ParsedAsyncAPISpec = any; // AsyncAPI parser types are complex, using any for now

/**
 * Parse and validate an AsyncAPI specification
 *
 * @param specPath - Path to the AsyncAPI spec file
 * @returns Parsed AsyncAPI document
 */
export async function parseAsyncAPISpec(specPath: string): Promise<ParsedAsyncAPISpec> {
  try {
    const parser = new Parser();
    // Register the Avro schema parser
    parser.registerSchemaParser(AvroSchemaParser());
    
    const { document, diagnostics } = await parser.parse(await loadFileContent(specPath));

    if (!document) {
      const errors = diagnostics.filter(d => d.severity === 0);
      throw new Error(`AsyncAPI parsing failed: ${errors.map(e => e.message).join(', ')}`);
    }

    return document;
  } catch (error) {
    throw new Error(`Failed to parse AsyncAPI spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse AsyncAPI spec from string content
 */
export async function parseAsyncAPIString(content: string): Promise<ParsedAsyncAPISpec> {
  try {
    const parser = new Parser();
    // Register the Avro schema parser
    parser.registerSchemaParser(AvroSchemaParser());
    
    const { document, diagnostics } = await parser.parse(content);

    if (!document) {
      const errors = diagnostics.filter(d => d.severity === 0);
      throw new Error(`AsyncAPI parsing failed: ${errors.map(e => e.message).join(', ')}`);
    }

    return document;
  } catch (error) {
    throw new Error(`Failed to parse AsyncAPI spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fallback parser for AsyncAPI specs with unsupported schema formats (like Avro)
 */
export async function parseAsyncAPIWithFallback(specPath: string): Promise<ParsedAsyncAPISpec> {
  try {
    const content = await loadFileContent(specPath);
    const yaml = await import('js-yaml');
    const spec = yaml.load(content) as any;

    // Create a minimal document-like object that our normalizer can work with
    return {
      _json: spec,
      info: () => ({
        title: () => spec.info?.title || 'Untitled API',
        version: () => spec.info?.version || '1.0.0',
        description: () => spec.info?.description || '',
      }),
      servers: () => spec.servers || {},
      channels: () => spec.channels || {},
      operations: () => spec.operations || {},
      // Add other methods as needed by our extractors
    };
  } catch (error) {
    throw new Error(`Failed to parse AsyncAPI spec with fallback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fallback parser for AsyncAPI specs with unsupported schema formats (like Avro) - from string
 */
export async function parseAsyncAPIStringWithFallback(content: string): Promise<ParsedAsyncAPISpec> {
  try {
    const yaml = await import('js-yaml');
    const spec = yaml.load(content) as any;

    // Create a minimal document-like object that our normalizer can work with
    return {
      _json: spec,
      info: () => ({
        title: () => spec.info?.title || 'Untitled API',
        version: () => spec.info?.version || '1.0.0',
        description: () => spec.info?.description || '',
      }),
      servers: () => spec.servers || {},
      channels: () => spec.channels || {},
      operations: () => spec.operations || {},
      // Add other methods as needed by our extractors
    };
  } catch (error) {
    throw new Error(`Failed to parse AsyncAPI spec with fallback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Load file content (helper for Node.js environment)
 */
async function loadFileContent(filePath: string): Promise<string> {
  if (typeof window === 'undefined') {
    // Server-side
    const fs = await import('fs/promises');
    return await fs.readFile(filePath, 'utf-8');
  } else {
    // Client-side
    const response = await fetch(filePath);
    return await response.text();
  }
}

/**
 * Extract basic info from AsyncAPI spec
 */
export function extractAsyncAPIInfo(document: ParsedAsyncAPISpec) {
  const info = document.info();
  return {
    title: typeof info.title === 'function' ? info.title() : (info.title || 'Untitled API'),
    version: typeof info.version === 'function' ? info.version() : (info.version || '1.0.0'),
    description: typeof info.description === 'function' ? info.description() : (info.description || ''),
    servers: extractAsyncAPIServers(document),
  };
}

/**
 * Extract servers from AsyncAPI spec
 */
export function extractAsyncAPIServers(document: ParsedAsyncAPISpec) {
  const servers = document.servers();
  const result: Array<{ url: string; description?: string; protocol?: string }> = [];

  if (!servers) {
    return result;
  }

  for (const [_name, server] of Object.entries(servers)) {
    const s = server as any;
    result.push({
      url: s.host ? (typeof s.host === 'function' ? s.host() : s.host) : '',
      description: s.description ? (typeof s.description === 'function' ? s.description() : s.description) : undefined,
      protocol: s.protocol ? (typeof s.protocol === 'function' ? s.protocol() : s.protocol) : undefined,
    });
  }

  return result;
}

/**
 * Extract all channels from AsyncAPI spec
 */
export function extractAsyncAPIChannels(document: ParsedAsyncAPISpec) {
  const channels = document.channels();
  const result: Array<{
    name: string;
    address: string;
    description?: string;
    bindings?: any;
  }> = [];

  if (!channels) {
    return result;
  }

  for (const [name, channel] of Object.entries(channels)) {
    const ch = channel as any;
    result.push({
      name,
      address: (ch.address ? (typeof ch.address === 'function' ? ch.address() : ch.address) : ch.address) || name,
      description: ch.description ? (typeof ch.description === 'function' ? ch.description() : ch.description) : ch.description,
      bindings: ch.bindings ? (typeof ch.bindings === 'function' ? ch.bindings() : ch.bindings) : ch.bindings,
    });
  }

  return result;
}

/**
 * Extract all operations from AsyncAPI spec
 */
export function extractAsyncAPIOperations(document: ParsedAsyncAPISpec) {
  const operations = document.operations();
  const result: Array<{
    id: string;
    action: 'send' | 'receive';
    channel: any;
    messages: any[];
    summary?: string;
    description?: string;
    tags?: any[];
  }> = [];

  if (!operations) {
    return result;
  }

  for (const [id, operation] of Object.entries(operations)) {
    const op = operation as any;

    // Skip internal AsyncAPI parser properties
    if (!op._json || id === 'collections' || id === '_meta') {
      continue;
    }

    // Use the x-parser-unique-object-id as the operation ID
    const actualId = op._json?.['x-parser-unique-object-id'] || (op.id ? op.id() : op.id) || id;

    // Get channel - handle both parsed and fallback formats
    let channel = op.channel ? (typeof op.channel === 'function' ? op.channel() : op.channel) : op.channel;
    if (!channel && op._json?.channel) {
      // Channel might be in the _json object
      channel = { 
        _json: op._json.channel, 
        address: () => op._json.channel.address || op._json.channel.$ref?.split('/').pop(),
        description: () => op._json.channel.description,
        tags: () => op._json.channel.tags
      };
    }

    result.push({
      id: actualId,
      action: (op.action ? (typeof op.action === 'function' ? op.action() : op.action) : op.action) || 'send',
      channel,
      messages: op.messages ? (Array.from ? Array.from(op.messages()) : op.messages) : [],
      summary: op.summary ? (typeof op.summary === 'function' ? op.summary() : op.summary) : op.summary,
      description: op.description ? (typeof op.description === 'function' ? op.description() : op.description) : op.description,
      tags: op.tags ? (typeof op.tags === 'function' ? op.tags() : op.tags) : undefined,
    });
  }

  return result;
}

/**
 * Extract message schema from AsyncAPI message
 */
export function extractMessageSchema(message: any) {
  if (!message) return null;

  try {
    const payload = message.payload ? (typeof message.payload === 'function' ? message.payload() : message.payload) : message.payload;

    return {
      name: message.name ? (typeof message.name === 'function' ? message.name() : message.name) : undefined,
      title: message.title ? (typeof message.title === 'function' ? message.title() : message.title) : undefined,
      summary: message.summary ? (typeof message.summary === 'function' ? message.summary() : message.summary) : undefined,
      contentType: message.contentType ? (typeof message.contentType === 'function' ? message.contentType() : message.contentType) : 'application/json',
      payload: payload,
      examples: message.examples ? (typeof message.examples === 'function' ? (Array.from ? Array.from(message.examples()) : message.examples) : message.examples) : [],
      schemaFormat: message.schemaFormat || (message._json?.payload?.schemaFormat),
    };
  } catch (error) {
    console.error('Error extracting message schema:', error);
    return null;
  }
}
