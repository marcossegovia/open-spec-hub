/**
 * Contract Utilities
 *
 * Utility functions for working with unified contracts and operations
 */

import {
  UnifiedContract,
  UnifiedOperation,
  CommunicationPattern,
  ActionType,
} from '../normalization/unified-model';

/**
 * Search operations by term (searches name, description, tags, location)
 */
export function searchOperations(
  operations: UnifiedOperation[],
  searchTerm: string
): UnifiedOperation[] {
  if (!searchTerm.trim()) {
    return operations;
  }

  const term = searchTerm.toLowerCase();

  return operations.filter(op => {
    // Search in name
    if (op.name.toLowerCase().includes(term)) return true;

    // Search in description
    if (op.description?.toLowerCase().includes(term)) return true;

    // Search in location
    if (op.location.toLowerCase().includes(term)) return true;

    // Search in tags
    if (op.tags.some(tag => tag.toLowerCase().includes(term))) return true;

    // Search in action type
    if (op.actionType.toLowerCase().includes(term)) return true;

    return false;
  });
}

/**
 * Group operations by tag/category
 */
export function groupOperationsByTag(
  operations: UnifiedOperation[]
): Record<string, UnifiedOperation[]> {
  const grouped: Record<string, UnifiedOperation[]> = {};

  operations.forEach(op => {
    if (op.tags.length === 0) {
      // Put untagged operations in "Other" category
      if (!grouped['Other']) {
        grouped['Other'] = [];
      }
      grouped['Other'].push(op);
    } else {
      // Add operation to each of its tags
      op.tags.forEach(tag => {
        if (!grouped[tag]) {
          grouped[tag] = [];
        }
        grouped[tag].push(op);
      });
    }
  });

  return grouped;
}

/**
 * Group operations by communication pattern
 */
export function groupOperationsByPattern(
  operations: UnifiedOperation[]
): Record<CommunicationPattern, UnifiedOperation[]> {
  const grouped: Record<CommunicationPattern, UnifiedOperation[]> = {
    'request-response': [],
    'publish-subscribe': [],
  };

  operations.forEach(op => {
    grouped[op.communicationPattern].push(op);
  });

  return grouped;
}

/**
 * Group operations by protocol
 */
export function groupOperationsByProtocol(
  operations: UnifiedOperation[]
): Record<string, UnifiedOperation[]> {
  const grouped: Record<string, UnifiedOperation[]> = {};

  operations.forEach(op => {
    const protocol = op.metadata.protocol;
    if (!grouped[protocol]) {
      grouped[protocol] = [];
    }
    grouped[protocol].push(op);
  });

  return grouped;
}

/**
 * Filter operations by action type
 */
export function filterByActionType(
  operations: UnifiedOperation[],
  actionTypes: ActionType[]
): UnifiedOperation[] {
  return operations.filter(op => actionTypes.includes(op.actionType));
}

/**
 * Filter operations by communication pattern
 */
export function filterByPattern(
  operations: UnifiedOperation[],
  pattern: CommunicationPattern
): UnifiedOperation[] {
  return operations.filter(op => op.communicationPattern === pattern);
}

/**
 * Filter operations by tag
 */
export function filterByTag(
  operations: UnifiedOperation[],
  tag: string
): UnifiedOperation[] {
  return operations.filter(op => op.tags.includes(tag));
}

/**
 * Sort operations by name
 */
export function sortByName(operations: UnifiedOperation[]): UnifiedOperation[] {
  return [...operations].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort operations by location
 */
export function sortByLocation(operations: UnifiedOperation[]): UnifiedOperation[] {
  return [...operations].sort((a, b) => a.location.localeCompare(b.location));
}

/**
 * Get all unique tags from operations
 */
export function getUniqueTags(operations: UnifiedOperation[]): string[] {
  const tagSet = new Set<string>();
  operations.forEach(op => {
    op.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Get all unique action types from operations
 */
export function getUniqueActionTypes(operations: UnifiedOperation[]): ActionType[] {
  const typeSet = new Set<ActionType>();
  operations.forEach(op => {
    typeSet.add(op.actionType);
  });
  return Array.from(typeSet);
}

/**
 * Count operations by action type
 */
export function countByActionType(
  operations: UnifiedOperation[]
): Record<ActionType, number> {
  const counts: Partial<Record<ActionType, number>> = {};

  operations.forEach(op => {
    counts[op.actionType] = (counts[op.actionType] || 0) + 1;
  });

  return counts as Record<ActionType, number>;
}

/**
 * Count operations by tag
 */
export function countByTag(operations: UnifiedOperation[]): Record<string, number> {
  const counts: Record<string, number> = {};

  operations.forEach(op => {
    op.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return counts;
}

/**
 * Merge multiple contracts into one
 */
export function mergeContracts(contracts: UnifiedContract[]): UnifiedContract {
  if (contracts.length === 0) {
    throw new Error('Cannot merge empty contracts array');
  }

  if (contracts.length === 1) {
    return contracts[0];
  }

  // Merge all operations
  const allOperations = contracts.flatMap(c => c.operations);

  // Merge all tags (unique)
  const allTags = Array.from(
    new Map(
      contracts
        .flatMap(c => c.tags)
        .map(tag => [tag.name, tag])
    ).values()
  );

  // Merge all servers (unique by URL)
  const allServers = Array.from(
    new Map(
      contracts
        .flatMap(c => c.servers)
        .map(server => [server.url, server])
    ).values()
  );

  return {
    id: 'merged-contract',
    name: contracts.map(c => c.name).join(' + '),
    description: `Merged documentation from ${contracts.length} contracts`,
    version: contracts[0].version,
    protocol: contracts[0].protocol, // Use first as primary
    operations: allOperations,
    tags: allTags,
    servers: allServers,
    securitySchemes: contracts[0].securitySchemes, // Use first
    metadata: {
      sourceProtocol: contracts[0].protocol,
      originalSpec: { merged: contracts.map(c => c.metadata.originalSpec) },
    },
  };
}

/**
 * Find operation by ID
 */
export function findOperationById(
  operations: UnifiedOperation[],
  id: string
): UnifiedOperation | undefined {
  return operations.find(op => op.id === id);
}

/**
 * Generate a slug from operation name
 */
export function generateOperationSlug(operation: UnifiedOperation): string {
  return `${operation.id}-${operation.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
