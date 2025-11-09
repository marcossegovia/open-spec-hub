/**
 * AsyncAPI Normalizer
 *
 * Transforms AsyncAPI specifications into the unified model.
 * This is where we abstract event-driven/messaging concepts into protocol-agnostic terms.
 */

/**
 * Remove AsyncAPI parser metadata fields (x-parser-*) from schema
 * These are internal fields added by the parser and should not be shown to users
 */
function cleanParserMetadata(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanParserMetadata);
  }

  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip any property starting with 'x-parser-'
    if (key.startsWith('x-parser-')) {
      continue;
    }
    // Recursively clean nested objects
    cleaned[key] = cleanParserMetadata(value);
  }
  return cleaned;
}

import {
  UnifiedContract,
  UnifiedOperation,
  UnifiedDataSchema,
  UnifiedParameter,
  ActionType,
  SchemaProperty,
  ContractTag,
  ServerInfo,
} from './unified-model.js';
import {
  ParsedAsyncAPISpec,
  extractAsyncAPIInfo,
  extractAsyncAPIChannels,
  extractAsyncAPIOperations,
  extractMessageSchema,
} from '../parsers/asyncapi-parser';

/**
 * Normalize an AsyncAPI spec to unified contract
 */
export function normalizeAsyncAPISpec(document: ParsedAsyncAPISpec): UnifiedContract {
  const info = extractAsyncAPIInfo(document);
  const operations = extractAsyncAPIOperations(document);
  const channels = extractAsyncAPIChannels(document);

  const unifiedOperations: UnifiedOperation[] = operations.map((op, index) =>
    normalizeAsyncAPIOperation(op, `asyncapi-op-${index}`, channels)
  );

  // Extract tags from operations and channels
  const tagSet = new Set<string>();
  unifiedOperations.forEach(op => op.tags.forEach(tag => tagSet.add(tag)));

  return {
    id: `asyncapi-${info.title.toLowerCase().replace(/\s+/g, '-')}`,
    name: info.title,
    description: info.description,
    version: info.version,
    protocol: 'asyncapi',
    operations: unifiedOperations,
    tags: Array.from(tagSet).map(name => ({ name })),
    servers: normalizeAsyncAPIServers(info.servers),
    metadata: {
      sourceProtocol: 'asyncapi',
      // Note: originalSpec is omitted as AsyncAPI parser returns class instances
      // that cannot be serialized for Next.js Server Components
    },
  };
}

/**
 * Normalize a single AsyncAPI operation to unified operation
 */
function normalizeAsyncAPIOperation(
  operation: any,
  fallbackId: string,
  channels: any[]
): UnifiedOperation {
  const actionType: ActionType = operation.action === 'send' ? 'PUBLISH' : 'SUBSCRIBE';

  // Get channel information
  const channel = operation.channel;

  // Extract channel address - try different methods
  let channelAddress;
  if (channel) {
    if (typeof channel.address === 'function') {
      channelAddress = channel.address();
    } else if (channel.address) {
      channelAddress = channel.address;
    } else if (channel._json?.address) {
      channelAddress = channel._json.address;
    }
  }

  // Fallback to operation ID if no address found
  if (!channelAddress) {
    channelAddress = operation.id;
  }

  const channelDescription = channel?.description ? channel.description() : undefined;

  // Get message schema
  const message = operation.messages?.[0];
  const messageSchema = message ? extractMessageSchema(message) : null;

  // Determine if input or output based on action
  const dataSchema = messageSchema ? normalizeAsyncAPIMessage(messageSchema) : undefined;
  const input = operation.action === 'send' ? dataSchema : undefined;
  const output = operation.action === 'receive' ? (dataSchema ? [dataSchema] : []) : [];

  // Extract tags from operation tags
  const tags: string[] = [];
  
  // Try different methods to extract operation tags
  if (operation.tags) {
    try {
      const operationTags = Array.from(operation.tags);
      tags.push(...operationTags.map((t: any) => t.name ? t.name() : (typeof t === 'string' ? t : t.name)));
    } catch (e) {
      // Fallback to direct access if tags() method doesn't exist
      if (operation._json?.tags) {
        const operationTags = operation._json.tags;
        if (Array.isArray(operationTags)) {
          tags.push(...operationTags.map((t: any) => typeof t === 'string' ? t : t.name));
        }
      }
    }
  }

  // Extract tags from channel tags
  if (channel?.tags) {
    try {
      const channelTags = Array.from(channel.tags());
      tags.push(...channelTags.map((t: any) => t.name()));
    } catch (e) {
      // Fallback to direct access if tags() method doesn't exist
      if (channel._json?.tags) {
        const channelTags = channel._json.tags;
        if (Array.isArray(channelTags)) {
          tags.push(...channelTags.map((t: any) => typeof t === 'string' ? t : t.name));
        }
      }
    }
  }

  // Get bindings for protocol-specific details
  const bindings = channel?.bindings ? channel.bindings() : undefined;

  return {
    id: operation.id || fallbackId,
    name: operation.summary || `${actionType} ${channelAddress}`,
    description: operation.description || channelDescription,
    actionType,
    location: channelAddress,
    communicationPattern: 'publish-subscribe', // AsyncAPI is always pub/sub
    tags,
    input,
    output,
    parameters: extractMessageHeaders(message),
    metadata: {
      protocol: 'asyncapi',
      operationId: operation.id,
      async: {
        channel: channelAddress,
        action: operation.action,
        bindings: normalizeBindings(bindings),
      },
    },
  };
}

/**
 * Normalize AsyncAPI message to unified data schema
 */
function normalizeAsyncAPIMessage(messageSchema: any): UnifiedDataSchema {
  const payload = messageSchema.payload;

  if (!payload) {
    return {
      name: messageSchema.name || messageSchema.title,
      description: messageSchema.summary,
      type: 'object',
      contentType: messageSchema.contentType || 'application/json',
    };
  }

  // Detect schema format (Avro vs JSON Schema)
  const schemaFormat = messageSchema.schemaFormat || 'default';
  const isAvro = schemaFormat.includes('avro');

  // Preserve original schema for "Original Schema" tab
  // Clean AsyncAPI parser metadata (x-parser-* fields) before storing
  const rawSchema = payload._json || payload;
  const originalSchema = cleanParserMetadata(rawSchema);

  // Check if payload has type() method or type property
  const payloadType = typeof payload.type === 'function' ? payload.type() : (payload.type || 'object');

  // Extract example from the first example if present
  let example: unknown = undefined;
  if (messageSchema.examples && Array.isArray(messageSchema.examples) && messageSchema.examples.length > 0) {
    const firstExample = messageSchema.examples[0];
    // AsyncAPI parser wraps examples in Example objects with payload() method
    // Call payload() to get the actual payload data (already in plain object form)
    if (typeof firstExample.payload === 'function') {
      example = firstExample.payload();
    } else {
      // Fallback to direct _json access if not a function
      example = firstExample._json?.payload;
    }
  }

  // Extract namespace for Avro schemas
  const namespace = isAvro && originalSchema?.namespace ? originalSchema.namespace : undefined;

  return {
    name: messageSchema.name || messageSchema.title,
    description: messageSchema.summary,
    type: payloadType,
    contentType: messageSchema.contentType || 'application/json',
    properties: normalizePayloadProperties(payload),
    required: payload.required ? payload.required() : undefined,
    example: example,
    originalSchema: originalSchema,
    schemaFormat: isAvro ? 'avro' : 'json-schema',
    metadata: namespace ? { namespace } : undefined,
  };
}

/**
 * Normalize payload properties
 */
function normalizePayloadProperties(payload: any): Record<string, SchemaProperty> | undefined {
  if (!payload.properties) return undefined;

  const properties: Record<string, SchemaProperty> = {};
  const props = typeof payload.properties === 'function' ? payload.properties() : payload.properties;

  if (!props) return undefined;

  for (const [propName, propSchema] of Object.entries(props)) {
    const schema = propSchema as any;

    // AsyncAPI parser wraps schemas in Schema objects with _json property
    const schemaData = schema._json || schema;

    properties[propName] = {
      type: schemaData.type || 'string',
      description: schemaData.description,
      example: schemaData.examples?.[0],
      enum: schemaData.enum,
      format: schemaData.format,
    };

    // Handle nested objects
    if (schemaData.properties) {
      properties[propName].properties = normalizePayloadProperties(schema);
    }

    // Handle arrays
    if (schemaData.items) {
      const itemsData = schemaData.items._json || schemaData.items;
      const arrayItem: any = {
        type: itemsData.type || 'string',
        description: itemsData.description,
      };

      // If array items are objects with properties, recursively normalize them
      if (itemsData.properties) {
        arrayItem.properties = normalizePayloadProperties(itemsData);
        if (itemsData.required) {
          arrayItem.required = itemsData.required;
        }
      }

      // Handle nested arrays within array items
      if (itemsData.items) {
        const nestedItemsData = itemsData.items._json || itemsData.items;
        arrayItem.items = {
          type: nestedItemsData.type || 'string',
          description: nestedItemsData.description,
        };

        // Recursively handle nested object properties in nested arrays
        if (nestedItemsData.properties) {
          arrayItem.items.properties = normalizePayloadProperties(nestedItemsData);
          if (nestedItemsData.required) {
            arrayItem.items.required = nestedItemsData.required;
          }
        }
      }

      properties[propName].items = arrayItem;
    }

    // Validation
    const validation: any = {};
    if (schemaData.minimum !== undefined) validation.minimum = schemaData.minimum;
    if (schemaData.maximum !== undefined) validation.maximum = schemaData.maximum;
    if (schemaData.minLength !== undefined) validation.minLength = schemaData.minLength;
    if (schemaData.maxLength !== undefined) validation.maxLength = schemaData.maxLength;

    if (Object.keys(validation).length > 0) {
      properties[propName].validation = validation;
    }
  }

  return properties;
}

/**
 * Extract message headers as parameters
 */
function extractMessageHeaders(message: any): UnifiedParameter[] {
  if (!message || !message.headers) return [];

  try {
    const headers = message.headers();
    if (!headers || !headers.properties) return [];

    const props = headers.properties();
    if (!props) return [];

    const parameters: UnifiedParameter[] = [];
    const headersData = headers._json || headers;

    for (const [headerName, headerSchema] of Object.entries(props)) {
      const schema = headerSchema as any;
      const schemaData = schema._json || schema;

      parameters.push({
        name: headerName,
        location: 'header',
        description: schemaData.description,
        required: headersData.required ? headersData.required.includes(headerName) : false,
        type: schemaData.type || 'string',
        format: schemaData.format,
      });
    }

    return parameters;
  } catch (error) {
    console.error('Error extracting message headers:', error);
    return [];
  }
}

/**
 * Normalize bindings for protocol-specific metadata
 */
function normalizeBindings(bindings: any): Record<string, unknown> {
  if (!bindings) return {};

  const result: Record<string, unknown> = {};

  // Kafka bindings
  if (bindings.kafka) {
    const kafka = bindings.kafka;
    result.kafka = {
      topic: kafka.topic,
      partitions: kafka.partitions,
      replicas: kafka.replicas,
      configs: kafka.configs,
    };
  }

  // MQTT bindings
  if (bindings.mqtt) {
    const mqtt = bindings.mqtt;
    result.mqtt = {
      qos: mqtt.qos,
      retain: mqtt.retain,
    };
  }

  return result;
}

/**
 * Normalize AsyncAPI servers
 */
function normalizeAsyncAPIServers(
  servers: Array<{ url: string; description?: string; protocol?: string }>
): ServerInfo[] {
  return servers.map(server => ({
    url: server.url,
    description: server.description,
    protocol: server.protocol || 'kafka',
  }));
}
