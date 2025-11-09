'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedContract, UnifiedOperation } from '@/lib/normalization/unified-model';
import {
  searchOperations,
  groupOperationsByTag,
  groupOperationsByPattern,
  getUniqueTags
} from '@/lib/utils/contract-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Sidebar from './Sidebar';

interface ContractExplorerProps {
  contracts: UnifiedContract[];
}

export default function ContractExplorer({ contracts }: ContractExplorerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'pattern' | 'tag'>('pattern');
  const [sidebarGroupBy, setSidebarGroupBy] = useState<'contract' | 'tag' | 'pattern'>('contract');

  const allOperations = contracts.flatMap(c => c.operations);
  const allTags = getUniqueTags(allOperations);

  const filteredOperations = searchTerm
    ? searchOperations(allOperations, searchTerm)
    : allOperations;

  const finalOperations = selectedTag
    ? filteredOperations.filter(op => op.tags.includes(selectedTag))
    : filteredOperations;

  const groupedOperations = groupBy === 'pattern'
    ? groupOperationsByPattern(finalOperations)
    : groupOperationsByTag(finalOperations);

  const handleOperationSelect = (operation: UnifiedOperation) => {
    router.push(`/operations/${operation.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">API Contract Explorer</h1>
          <p className="text-muted-foreground">
            Unified view of all operations across {contracts.length} contract{contracts.length !== 1 ? 's' : ''}
            {' '}({allOperations.length} operation{allOperations.length !== 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {/* Layout: Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-muted/10 min-h-[calc(100vh-140px)] sticky top-0 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-3">Navigation</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSidebarGroupBy('contract')}
                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                  sidebarGroupBy === 'contract'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                By Contract
              </button>
              <button
                onClick={() => setSidebarGroupBy('tag')}
                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                  sidebarGroupBy === 'tag'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                By Category
              </button>
              <button
                onClick={() => setSidebarGroupBy('pattern')}
                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                  sidebarGroupBy === 'pattern'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                By Pattern
              </button>
            </div>
          </div>
          <Sidebar
            contracts={contracts}
            operations={allOperations}
            onOperationSelect={handleOperationSelect}
            groupBy={sidebarGroupBy}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search and Filters */}
          <div className="border-b bg-muted/20">
            <div className="px-4 py-4 space-y-4">
              {/* Search */}
              <div>
                <Input
                  type="search"
                  placeholder="Search operations by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-2xl"
                />
              </div>

              {/* Group By Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Group by:</span>
                <button
                  onClick={() => setGroupBy('pattern')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    groupBy === 'pattern'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Communication Pattern
                </button>
                <button
                  onClick={() => setGroupBy('tag')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    groupBy === 'tag'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Category
                </button>
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter by tag:</span>
                  <Badge
                    variant={selectedTag === null ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(null)}
                  >
                    All
                  </Badge>
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Operations Grid */}
          <div className="px-4 py-8">
            {finalOperations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No operations found. Try adjusting your search or filters.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedOperations).map(([groupName, operations]) => (
                  <div key={groupName}>
                    <h2 className="text-2xl font-semibold mb-4 capitalize">
                      {groupName.replace(/-/g, ' ')}
                      <span className="text-muted-foreground text-base ml-2">
                        ({operations.length})
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {operations.map(operation => (
                        <OperationCardSimple
                          key={operation.id}
                          operation={operation}
                          contract={contracts.find(c =>
                            c.operations.some(op => op.id === operation.id)
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function OperationCardSimple({
  operation,
  contract
}: {
  operation: UnifiedOperation;
  contract?: UnifiedContract;
}) {
  const router = useRouter();

  const actionColors: Record<string, string> = {
    'GET': 'bg-blue-500',
    'POST': 'bg-green-500',
    'PUT': 'bg-yellow-500',
    'PATCH': 'bg-yellow-500',
    'DELETE': 'bg-red-500',
    'PUBLISH': 'bg-purple-500',
    'SUBSCRIBE': 'bg-orange-500',
  };

  const patternIcons: Record<string, string> = {
    'request-response': '⇄',
    'publish-subscribe': '⇉',
  };

  const handleClick = () => {
    router.push(`/operations/${operation.id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={`${actionColors[operation.actionType]} text-white`}>
            {operation.actionType}
          </Badge>
          <span className="text-xl" title={operation.communicationPattern}>
            {patternIcons[operation.communicationPattern]}
          </span>
        </div>
        <CardTitle className="text-lg">{operation.name}</CardTitle>
        <CardDescription className="font-mono text-xs break-all">
          {operation.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {operation.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {operation.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {contract && (
            <Badge variant="outline" className="text-xs">
              {contract.protocol === 'openapi' ? '🔷 REST' : '🟣 Event'}
            </Badge>
          )}
          {operation.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {operation.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{operation.tags.length - 2}
            </Badge>
          )}
        </div>

        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
          {operation.input && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Input:</span>
              <span className="font-mono">{operation.input.type}</span>
            </div>
          )}
          {operation.output && operation.output.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Output:</span>
              <span className="font-mono">
                {operation.output.map(o => o.type).join(', ')}
              </span>
            </div>
          )}
          {operation.parameters.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Parameters:</span>
              <span>{operation.parameters.length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
