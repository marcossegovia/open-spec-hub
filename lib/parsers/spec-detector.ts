/**
 * Spec Type Detector
 *
 * Auto-detects whether a spec file is OpenAPI or AsyncAPI
 * by examining its content structure.
 */

import { ProtocolType } from '../normalization/unified-model';

/**
 * Detect spec type from parsed content
 */
export function detectSpecType(spec: unknown): ProtocolType {
  if (!spec || typeof spec !== 'object') {
    throw new Error('Invalid spec: must be an object');
  }

  const specObj = spec as Record<string, unknown>;

  // Check for AsyncAPI
  if ('asyncapi' in specObj) {
    return 'asyncapi';
  }

  // Check for OpenAPI
  if ('openapi' in specObj || 'swagger' in specObj) {
    return 'openapi';
  }

  throw new Error(
    'Unable to detect spec type. Spec must have "openapi", "swagger", or "asyncapi" field.'
  );
}

/**
 * Detect spec type from file path
 */
export function detectSpecTypeFromPath(filePath: string): ProtocolType | null {
  const normalizedPath = filePath.toLowerCase();

  if (normalizedPath.includes('/asyncapi/') || normalizedPath.includes('asyncapi')) {
    return 'asyncapi';
  }

  if (normalizedPath.includes('/openapi/') || normalizedPath.includes('openapi') || normalizedPath.includes('swagger')) {
    return 'openapi';
  }

  return null;
}

/**
 * Validate spec version compatibility
 */
export function validateSpecVersion(spec: unknown, type: ProtocolType): void {
  const specObj = spec as Record<string, unknown>;

  if (type === 'openapi') {
    const version = specObj.openapi || specObj.swagger;
    if (!version) {
      throw new Error('OpenAPI spec missing version field');
    }

    const versionStr = String(version);
    if (!versionStr.startsWith('3.')) {
      console.warn(`OpenAPI version ${versionStr} detected. This platform is optimized for OpenAPI 3.x`);
    }
  }

  if (type === 'asyncapi') {
    const version = specObj.asyncapi;
    if (!version) {
      throw new Error('AsyncAPI spec missing version field');
    }

    const versionStr = String(version);
    if (!versionStr.startsWith('2.') && !versionStr.startsWith('3.')) {
      console.warn(`AsyncAPI version ${versionStr} detected. This platform is optimized for AsyncAPI 2.x and 3.x`);
    }
  }
}
