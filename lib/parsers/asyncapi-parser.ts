/**
 * AsyncAPI Parser
 *
 * Parses and validates AsyncAPI 2.x/3.x specifications
 */

import { Parser } from '@asyncapi/parser';

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
  return {
    title: document.info().title(),
    version: document.info().version(),
    description: document.info().description(),
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
      url: s.host ? s.host() : '',
      description: s.description ? s.description() : undefined,
      protocol: s.protocol ? s.protocol() : undefined,
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
      address: ch.address ? ch.address() : name,
      description: ch.description ? ch.description() : undefined,
      bindings: ch.bindings ? ch.bindings() : undefined,
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
    const actualId = op._json['x-parser-unique-object-id'] || op.id() || id;

    // Get channel - use _json.channel.address if available
    let channel = op.channel ? op.channel() : null;
    if (!channel && op._json?.channel?.address) {
      // Channel might be in the _json object
      channel = { _json: op._json.channel, address: () => op._json.channel.address };
    }

    result.push({
      id: actualId,
      action: op.action ? op.action() : 'send',
      channel,
      messages: op.messages ? Array.from(op.messages()) : [],
      summary: op.summary ? op.summary() : undefined,
      description: op.description ? op.description() : undefined,
      tags: op.tags ? op.tags() : undefined,
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
    const payload = message.payload ? message.payload() : null;

    return {
      name: message.name ? message.name() : undefined,
      title: message.title ? message.title() : undefined,
      summary: message.summary ? message.summary() : undefined,
      contentType: message.contentType ? message.contentType() : 'application/json',
      payload: payload,
      examples: message.examples ? Array.from(message.examples()) : [],
    };
  } catch (error) {
    console.error('Error extracting message schema:', error);
    return null;
  }
}
