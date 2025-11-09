/**
 * Unified API Contract Model
 *
 * This file defines the protocol-agnostic data structures that represent
 * any API contract (OpenAPI, AsyncAPI, etc.) in a common format.
 *
 * Philosophy: Abstract away protocol-specific terminology and present
 * all APIs through universal concepts like "Operation", "Input", "Output".
 */

/**
 * Source protocol type
 */
export type ProtocolType = 'openapi' | 'asyncapi';

/**
 * Communication pattern
 */
export type CommunicationPattern =
  | 'request-response'  // Synchronous (REST)
  | 'publish-subscribe'; // Asynchronous (Events)

/**
 * Action types - universal across protocols
 */
export type ActionType =
  | 'GET'       // HTTP GET
  | 'POST'      // HTTP POST
  | 'PUT'       // HTTP PUT
  | 'PATCH'     // HTTP PATCH
  | 'DELETE'    // HTTP DELETE
  | 'PUBLISH'   // Publish message/event
  | 'SUBSCRIBE'; // Subscribe to messages/events

/**
 * Parameter location
 */
export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

/**
 * A complete API contract (OpenAPI or AsyncAPI document)
 */
export interface UnifiedContract {
  /** Unique identifier for this contract */
  id: string;

  /** Contract name/title */
  name: string;

  /** Contract description */
  description?: string;

  /** Version */
  version: string;

  /** Source protocol */
  protocol: ProtocolType;

  /** All operations in this contract */
  operations: UnifiedOperation[];

  /** Tags/categories for grouping operations */
  tags: ContractTag[];

  /** Server/endpoint information */
  servers: ServerInfo[];

  /** Security schemes (if any) */
  securitySchemes?: Record<string, SecurityScheme>;

  /** Protocol-specific metadata (preserved for advanced users) */
  metadata: {
    sourceProtocol: ProtocolType;
    originalSpec?: unknown; // Reference to original parsed spec
  };
}

/**
 * Tag/category for grouping operations
 */
export interface ContractTag {
  name: string;
  description?: string;
}

/**
 * Server information
 */
export interface ServerInfo {
  url: string;
  description?: string;
  protocol?: string; // e.g., "https", "kafka", "mqtt"
}

/**
 * Security scheme
 */
export interface SecurityScheme {
  type: string; // e.g., "http", "apiKey", "oauth2"
  scheme?: string;
  description?: string;
}

/**
 * A single operation - the core unit of API interaction
 *
 * This represents:
 * - REST: An HTTP endpoint (GET /users, POST /orders)
 * - AsyncAPI: A channel operation (publish to topic, subscribe to topic)
 */
export interface UnifiedOperation {
  /** Unique identifier */
  id: string;

  /** Operation name/summary */
  name: string;

  /** Detailed description */
  description?: string;

  /** Action type (GET, POST, PUBLISH, SUBSCRIBE, etc.) */
  actionType: ActionType;

  /** Location (URL path for REST, channel name for AsyncAPI) */
  location: string;

  /** Communication pattern */
  communicationPattern: CommunicationPattern;

  /** Tags/categories this operation belongs to */
  tags: string[];

  /** Input data schema (request body or message to publish) */
  input?: UnifiedDataSchema;

  /** Output data schema (response or message to receive) */
  output?: UnifiedDataSchema[];

  /** Parameters (path params, query params, headers, etc.) */
  parameters: UnifiedParameter[];

  /** Security requirements */
  security?: string[];

  /** Code examples */
  examples?: OperationExample[];

  /** Protocol-specific metadata */
  metadata: OperationMetadata;
}

/**
 * Protocol-specific metadata for an operation
 */
export interface OperationMetadata {
  /** Source protocol */
  protocol: ProtocolType;

  /** Original operation ID (if available) */
  operationId?: string;

  /** For REST: HTTP method, path, status codes */
  rest?: {
    method: string;
    path: string;
    statusCodes?: string[];
  };

  /** For AsyncAPI: channel, action, bindings */
  async?: {
    channel: string;
    action: 'send' | 'receive';
    bindings?: Record<string, unknown>; // Kafka, MQTT, etc. specific config
  };
}

/**
 * Data schema - represents structure of data being exchanged
 *
 * This is used for:
 * - REST: Request/response body schemas
 * - AsyncAPI: Message payload schemas
 */
export interface UnifiedDataSchema {
  /** Schema name/title */
  name?: string;

  /** Description */
  description?: string;

  /** JSON Schema type */
  type: string;

  /** Properties (for objects) */
  properties?: Record<string, SchemaProperty>;

  /** Items schema (for arrays) */
  items?: UnifiedDataSchema;

  /** Required property names */
  required?: string[];

  /** Example value */
  example?: unknown;

  /** Enum values (if applicable) */
  enum?: unknown[];

  /** Format (e.g., "date-time", "uuid", "email") */
  format?: string;

  /** Additional validation rules */
  validation?: {
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minItems?: number;
    maxItems?: number;
  };

  /** For REST: Associated status code (if this is a response) */
  statusCode?: string;

  /** Content type */
  contentType?: string;
}

/**
 * Schema property definition
 */
export interface SchemaProperty {
  type: string;
  description?: string;
  required?: boolean;
  example?: unknown;
  enum?: unknown[];
  format?: string;
  properties?: Record<string, SchemaProperty>; // For nested objects
  items?: SchemaProperty; // For arrays
  validation?: {
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

/**
 * Parameter (path param, query param, header, etc.)
 */
export interface UnifiedParameter {
  /** Parameter name */
  name: string;

  /** Location (path, query, header, etc.) */
  location: ParameterLocation;

  /** Description */
  description?: string;

  /** Is required? */
  required: boolean;

  /** Data type */
  type: string;

  /** Format */
  format?: string;

  /** Example value */
  example?: unknown;

  /** Default value */
  default?: unknown;

  /** Enum values */
  enum?: unknown[];
}

/**
 * Code example for an operation
 */
export interface OperationExample {
  /** Programming language */
  language: string;

  /** Code snippet */
  code: string;

  /** Example title/description */
  title?: string;
}

/**
 * Helper function to determine if an operation is synchronous
 */
export function isSynchronous(operation: UnifiedOperation): boolean {
  return operation.communicationPattern === 'request-response';
}

/**
 * Helper function to determine if an operation is asynchronous
 */
export function isAsynchronous(operation: UnifiedOperation): boolean {
  return operation.communicationPattern === 'publish-subscribe';
}

/**
 * Helper function to get action type color (for UI)
 */
export function getActionTypeColor(actionType: ActionType): string {
  const colors: Record<ActionType, string> = {
    'GET': 'blue',        // Read
    'POST': 'green',      // Create
    'PUT': 'yellow',      // Update (full)
    'PATCH': 'yellow',    // Update (partial)
    'DELETE': 'red',      // Delete
    'PUBLISH': 'purple',  // Send message
    'SUBSCRIBE': 'orange', // Receive message
  };

  return colors[actionType];
}

/**
 * Helper function to get communication pattern icon
 */
export function getCommunicationPatternIcon(pattern: CommunicationPattern): string {
  return pattern === 'request-response' ? '⇄' : '⇉';
}
