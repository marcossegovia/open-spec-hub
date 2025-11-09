/**
 * OpenAPI Parser
 *
 * Parses and validates OpenAPI 3.x specifications
 */

import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';

export type ParsedOpenAPISpec = OpenAPIV3.Document;

/**
 * Parse and validate an OpenAPI specification
 *
 * @param specPath - Path to the OpenAPI spec file
 * @returns Parsed and dereferenced OpenAPI document
 */
export async function parseOpenAPISpec(specPath: string): Promise<ParsedOpenAPISpec> {
  try {
    // Parse and dereference (resolve all $ref pointers)
    const api = await SwaggerParser.validate(specPath, {
      dereference: {
        circular: 'ignore', // Handle circular references gracefully
      },
    });

    return api as ParsedOpenAPISpec;
  } catch (error) {
    throw new Error(`Failed to parse OpenAPI spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse OpenAPI spec from object (already loaded)
 */
export async function parseOpenAPIObject(spec: unknown): Promise<ParsedOpenAPISpec> {
  try {
    const api = await SwaggerParser.validate(spec as OpenAPI.Document, {
      dereference: {
        circular: 'ignore',
      },
    });

    return api as ParsedOpenAPISpec;
  } catch (error) {
    throw new Error(`Failed to parse OpenAPI spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract basic info from OpenAPI spec
 */
export function extractOpenAPIInfo(spec: ParsedOpenAPISpec) {
  return {
    title: spec.info.title,
    version: spec.info.version,
    description: spec.info.description,
    servers: spec.servers?.map(server => ({
      url: server.url,
      description: server.description,
    })) || [],
  };
}

/**
 * Extract all paths/endpoints from OpenAPI spec
 */
export function extractOpenAPIPaths(spec: ParsedOpenAPISpec) {
  const paths: Array<{
    path: string;
    method: string;
    operation: OpenAPIV3.OperationObject;
  }> = [];

  if (!spec.paths) {
    return paths;
  }

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;

    const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'] as const;

    for (const method of methods) {
      const operation = pathItem[method];
      if (operation) {
        paths.push({
          path,
          method: method.toUpperCase(),
          operation,
        });
      }
    }
  }

  return paths;
}

/**
 * Extract tags from OpenAPI spec
 */
export function extractOpenAPITags(spec: ParsedOpenAPISpec) {
  return spec.tags?.map(tag => ({
    name: tag.name,
    description: tag.description,
  })) || [];
}

/**
 * Extract security schemes from OpenAPI spec
 */
export function extractOpenAPISecuritySchemes(spec: ParsedOpenAPISpec) {
  const schemes = spec.components?.securitySchemes;
  if (!schemes) return {};

  const result: Record<string, any> = {};

  for (const [name, scheme] of Object.entries(schemes)) {
    if ('$ref' in scheme) continue; // Skip refs (should be dereferenced)

    result[name] = {
      type: scheme.type,
      scheme: 'scheme' in scheme ? scheme.scheme : undefined,
      description: scheme.description,
    };
  }

  return result;
}
