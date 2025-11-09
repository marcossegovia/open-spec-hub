/**
 * OpenAPI Normalizer
 *
 * Transforms OpenAPI specifications into the unified model.
 * This is where we abstract REST-specific concepts into protocol-agnostic terms.
 */

import { OpenAPIV3 } from 'openapi-types';
import {
  UnifiedContract,
  UnifiedOperation,
  UnifiedDataSchema,
  UnifiedParameter,
  ActionType,
  SchemaProperty,
  ContractTag,
  ServerInfo,
} from './unified-model';
import {
  ParsedOpenAPISpec,
  extractOpenAPIInfo,
  extractOpenAPIPaths,
  extractOpenAPITags,
  extractOpenAPISecuritySchemes,
} from '../parsers/openapi-parser';

/**
 * Normalize an OpenAPI spec to unified contract
 */
export function normalizeOpenAPISpec(spec: ParsedOpenAPISpec): UnifiedContract {
  const info = extractOpenAPIInfo(spec);
  const paths = extractOpenAPIPaths(spec);
  const tags = extractOpenAPITags(spec);
  const securitySchemes = extractOpenAPISecuritySchemes(spec);

  const operations: UnifiedOperation[] = paths.map((pathInfo, index) =>
    normalizeOpenAPIOperation(pathInfo.path, pathInfo.method, pathInfo.operation, `openapi-op-${index}`)
  );

  return {
    id: `openapi-${info.title.toLowerCase().replace(/\s+/g, '-')}`,
    name: info.title,
    description: info.description,
    version: info.version,
    protocol: 'openapi',
    operations,
    tags: normalizeTags(tags),
    servers: normalizeServers(info.servers),
    securitySchemes: securitySchemes as any,
    metadata: {
      sourceProtocol: 'openapi',
      originalSpec: spec,
    },
  };
}

/**
 * Normalize a single OpenAPI operation to unified operation
 */
function normalizeOpenAPIOperation(
  path: string,
  method: string,
  operation: OpenAPIV3.OperationObject,
  fallbackId: string
): UnifiedOperation {
  const actionType = method.toUpperCase() as ActionType;

  return {
    id: operation.operationId || fallbackId,
    name: operation.summary || `${method} ${path}`,
    description: operation.description,
    actionType,
    location: path,
    communicationPattern: 'request-response', // REST is always request-response
    tags: operation.tags || [],
    input: normalizeRequestBody(operation.requestBody),
    output: normalizeResponses(operation.responses),
    parameters: normalizeParameters(operation.parameters || []),
    security: operation.security?.flatMap(s => Object.keys(s)),
    metadata: {
      protocol: 'openapi',
      operationId: operation.operationId,
      rest: {
        method,
        path,
        statusCodes: operation.responses ? Object.keys(operation.responses) : [],
      },
    },
  };
}

/**
 * Normalize OpenAPI request body to unified data schema
 */
function normalizeRequestBody(
  requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject | undefined
): UnifiedDataSchema | undefined {
  if (!requestBody || '$ref' in requestBody) {
    return undefined;
  }

  const content = requestBody.content;
  if (!content) return undefined;

  // Prefer application/json
  const jsonContent = content['application/json'] || Object.values(content)[0];
  if (!jsonContent || !jsonContent.schema) return undefined;

  const schema = jsonContent.schema as OpenAPIV3.SchemaObject;
  const normalized = normalizeSchema(schema, 'application/json');

  // Extract example from media type object if present
  if (jsonContent.example && !normalized.example) {
    normalized.example = jsonContent.example;
  }

  return normalized;
}

/**
 * Normalize OpenAPI responses to unified data schemas
 */
function normalizeResponses(
  responses: OpenAPIV3.ResponsesObject | undefined
): UnifiedDataSchema[] {
  if (!responses) return [];

  const schemas: UnifiedDataSchema[] = [];

  for (const [statusCode, response] of Object.entries(responses)) {
    if ('$ref' in response) continue;

    const content = response.content;
    if (!content) {
      // Response with no body (e.g., 204 No Content)
      schemas.push({
        name: `${statusCode} Response`,
        description: response.description,
        type: 'null',
        statusCode,
      });
      continue;
    }

    const jsonContent = content['application/json'] || Object.values(content)[0];
    if (!jsonContent || !jsonContent.schema) continue;

    const schema = jsonContent.schema as OpenAPIV3.SchemaObject;
    const normalized = normalizeSchema(schema, 'application/json');

    // Extract example from media type object if present
    if (jsonContent.example && !normalized.example) {
      normalized.example = jsonContent.example;
    }

    schemas.push({
      ...normalized,
      name: normalized.name || `${statusCode} Response`,
      statusCode,
      description: normalized.description || response.description,
    });
  }

  return schemas;
}

/**
 * Normalize OpenAPI parameters to unified parameters
 */
function normalizeParameters(
  parameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[]
): UnifiedParameter[] {
  return parameters
    .filter((p): p is OpenAPIV3.ParameterObject => !('$ref' in p))
    .map(param => ({
      name: param.name,
      location: param.in as any,
      description: param.description,
      required: param.required || false,
      type: (param.schema as OpenAPIV3.SchemaObject)?.type || 'string',
      format: (param.schema as OpenAPIV3.SchemaObject)?.format,
      example: param.example || (param.schema as OpenAPIV3.SchemaObject)?.example,
      default: (param.schema as OpenAPIV3.SchemaObject)?.default,
      enum: (param.schema as OpenAPIV3.SchemaObject)?.enum,
    }));
}

/**
 * Normalize OpenAPI schema object to unified schema
 */
function normalizeSchema(
  schema: OpenAPIV3.SchemaObject,
  contentType: string = 'application/json'
): UnifiedDataSchema {
  const normalized: UnifiedDataSchema = {
    name: schema.title,
    description: schema.description,
    type: schema.type || 'object',
    contentType,
    example: schema.example,
    enum: schema.enum,
    format: schema.format,
    // Preserve original schema for "Original Schema" tab
    originalSchema: schema,
    schemaFormat: 'json-schema',
  };

  // Handle properties (for objects)
  if (schema.properties) {
    normalized.properties = {};
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      normalized.properties[propName] = normalizeSchemaProperty(
        propSchema as OpenAPIV3.SchemaObject
      );
    }
    normalized.required = schema.required;
  }

  // Handle items (for arrays)
  if ('items' in schema && schema.items) {
    normalized.items = normalizeSchema(schema.items as OpenAPIV3.SchemaObject, contentType);
  }

  // Validation rules
  if (schema.minimum !== undefined || schema.maximum !== undefined ||
      schema.minLength !== undefined || schema.maxLength !== undefined) {
    normalized.validation = {
      minimum: schema.minimum,
      maximum: schema.maximum,
      minLength: schema.minLength,
      maxLength: schema.maxLength,
      pattern: schema.pattern,
      minItems: schema.minItems,
      maxItems: schema.maxItems,
    };
  }

  return normalized;
}

/**
 * Normalize schema property
 */
function normalizeSchemaProperty(schema: OpenAPIV3.SchemaObject): SchemaProperty {
  const prop: SchemaProperty = {
    type: schema.type || 'string',
    description: schema.description,
    example: schema.example,
    enum: schema.enum,
    format: schema.format,
  };

  // Handle nested objects
  if (schema.properties) {
    prop.properties = {};
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      prop.properties[propName] = normalizeSchemaProperty(propSchema as OpenAPIV3.SchemaObject);
    }
  }

  // Handle arrays
  if ('items' in schema && schema.items) {
    prop.items = normalizeSchemaProperty(schema.items as OpenAPIV3.SchemaObject);
  }

  // Validation
  if (schema.minimum !== undefined || schema.maximum !== undefined) {
    prop.validation = {
      minimum: schema.minimum,
      maximum: schema.maximum,
      minLength: schema.minLength,
      maxLength: schema.maxLength,
      pattern: schema.pattern,
    };
  }

  return prop;
}

/**
 * Normalize tags
 */
function normalizeTags(tags: Array<{ name: string; description?: string }>): ContractTag[] {
  return tags.map(tag => ({
    name: tag.name,
    description: tag.description,
  }));
}

/**
 * Normalize servers
 */
function normalizeServers(servers: Array<{ url: string; description?: string }>): ServerInfo[] {
  return servers.map(server => ({
    url: server.url,
    description: server.description,
    protocol: server.url.startsWith('https') ? 'https' : 'http',
  }));
}
