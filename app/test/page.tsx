/**
 * Test Page - Phase 2 Demo
 *
 * This page demonstrates the parser and normalization layer working with
 * the example OpenAPI and AsyncAPI specs.
 */

import { loadAllSpecs } from '@/lib/loaders/spec-loader';
import { searchOperations, groupOperationsByTag, groupOperationsByPattern } from '@/lib/utils/contract-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function TestPage() {
  let contracts;
  let error = null;

  try {
    contracts = await loadAllSpecs();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Specs</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>No Specs Found</CardTitle>
            <CardDescription>
              No API specifications found in specs/openapi/ or specs/asyncapi/
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Aggregate all operations
  const allOperations = contracts.flatMap(c => c.operations);

  // Group by pattern
  const byPattern = groupOperationsByPattern(allOperations);

  // Group by tag
  const byTag = groupOperationsByTag(allOperations);

  // Get action type color
  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      'GET': 'bg-blue-500',
      'POST': 'bg-green-500',
      'PUT': 'bg-yellow-500',
      'PATCH': 'bg-yellow-500',
      'DELETE': 'bg-red-500',
      'PUBLISH': 'bg-purple-500',
      'SUBSCRIBE': 'bg-orange-500',
    };
    return colors[actionType] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Phase 2 Test - Parser & Normalization Demo</h1>
        <p className="text-muted-foreground">
          Loaded {contracts.length} contract(s) with {allOperations.length} total operations
        </p>
      </div>

      {/* Contracts Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Loaded Contracts</CardTitle>
          <CardDescription>All API contracts detected and parsed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract, idx) => (
              <div key={idx} className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{contract.name}</h3>
                  <Badge variant="outline">{contract.protocol.toUpperCase()}</Badge>
                  <Badge variant="secondary">v{contract.version}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{contract.description}</p>
                <p className="text-xs text-muted-foreground">
                  {contract.operations.length} operations • {contract.tags.length} tags
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Operations by Communication Pattern</CardTitle>
          <CardDescription>Synchronous vs Asynchronous operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span>⇄ Request → Response</span>
                <Badge>{byPattern['request-response'].length}</Badge>
              </h3>
              <div className="grid gap-2">
                {byPattern['request-response'].slice(0, 5).map((op, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                    <Badge className={getActionColor(op.actionType)}>{op.actionType}</Badge>
                    <code className="text-sm flex-1">{op.location}</code>
                    <span className="text-sm text-muted-foreground">{op.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span>⇉ Publish / Subscribe</span>
                <Badge>{byPattern['publish-subscribe'].length}</Badge>
              </h3>
              <div className="grid gap-2">
                {byPattern['publish-subscribe'].slice(0, 5).map((op, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                    <Badge className={getActionColor(op.actionType)}>{op.actionType}</Badge>
                    <code className="text-sm flex-1">{op.location}</code>
                    <span className="text-sm text-muted-foreground">{op.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* By Category/Tag */}
      <Card>
        <CardHeader>
          <CardTitle>Operations by Category</CardTitle>
          <CardDescription>Grouped by tags (protocol-agnostic)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(byTag).map(([tag, ops]) => (
              <div key={tag}>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span>{tag}</span>
                  <Badge variant="secondary">{ops.length}</Badge>
                </h3>
                <div className="grid gap-2 pl-4">
                  {ops.map((op, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Badge className={`${getActionColor(op.actionType)} text-xs`}>
                        {op.actionType}
                      </Badge>
                      <code className="flex-1">{op.location}</code>
                      <Badge variant="outline" className="text-xs">
                        {op.metadata.protocol}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Operation Detail */}
      {allOperations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Operation Detail (First Operation)</CardTitle>
            <CardDescription>Showing the unified model structure</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(allOperations[0], null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
