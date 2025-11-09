'use client';

import { UnifiedOperation, UnifiedContract, getActionTypeColor } from '@/lib/normalization/unified-model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OperationCardProps {
  operation: UnifiedOperation;
  contract?: UnifiedContract;
  onClick?: () => void;
  showContract?: boolean;
}

const actionTypeColors: Record<string, string> = {
  'GET': 'bg-blue-500 hover:bg-blue-600',
  'POST': 'bg-green-500 hover:bg-green-600',
  'PUT': 'bg-yellow-500 hover:bg-yellow-600',
  'PATCH': 'bg-yellow-500 hover:bg-yellow-600',
  'DELETE': 'bg-red-500 hover:bg-red-600',
  'PUBLISH': 'bg-purple-500 hover:bg-purple-600',
  'SUBSCRIBE': 'bg-orange-500 hover:bg-orange-600',
};

const patternIcons: Record<string, string> = {
  'request-response': '⇄',
  'publish-subscribe': '⇉',
};

const patternLabels: Record<string, string> = {
  'request-response': 'Request/Response',
  'publish-subscribe': 'Publish/Subscribe',
};

export default function OperationCard({
  operation,
  contract,
  onClick,
  showContract = true
}: OperationCardProps) {
  const hasInput = !!operation.input;
  const hasOutput = operation.output && operation.output.length > 0;
  const hasParameters = operation.parameters.length > 0;

  return (
    <Card
      className={`hover:shadow-lg transition-all ${onClick ? 'cursor-pointer hover:border-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        {/* Action Type Badge and Pattern Icon */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={`${actionTypeColors[operation.actionType]} text-white border-none`}>
            {operation.actionType}
          </Badge>
          <span
            className="text-xl"
            title={patternLabels[operation.communicationPattern]}
            aria-label={patternLabels[operation.communicationPattern]}
          >
            {patternIcons[operation.communicationPattern]}
          </span>
        </div>

        {/* Operation Name */}
        <CardTitle className="text-lg leading-tight">
          {operation.name}
        </CardTitle>

        {/* Location (URL path or channel name) */}
        <CardDescription className="font-mono text-xs break-all mt-1">
          {operation.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        {operation.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {operation.description}
          </p>
        )}

        {/* Tags and Protocol Badge */}
        {(operation.tags.length > 0 || (showContract && contract)) && (
          <div className="flex flex-wrap gap-1">
            {showContract && contract && (
              <Badge variant="outline" className="text-xs">
                {contract.protocol === 'openapi' ? '🔷 REST' : '🟣 Event'}
              </Badge>
            )}
            {operation.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {operation.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{operation.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Data Summary */}
        <div className="pt-3 border-t text-xs text-muted-foreground space-y-1.5">
          {hasInput && (
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[4rem]">Input:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {operation.input!.type}
              </code>
              {operation.input!.name && (
                <span className="text-muted-foreground">
                  ({operation.input!.name})
                </span>
              )}
            </div>
          )}

          {hasOutput && (
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[4rem]">Output:</span>
              <div className="flex flex-wrap gap-1">
                {operation.output!.map((output, idx) => (
                  <code key={idx} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {output.statusCode && `${output.statusCode}: `}
                    {output.type}
                  </code>
                ))}
              </div>
            </div>
          )}

          {hasParameters && (
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[4rem]">Parameters:</span>
              <span>
                {operation.parameters.length} parameter{operation.parameters.length !== 1 ? 's' : ''}
              </span>
              <span className="text-muted-foreground">
                ({operation.parameters.filter(p => p.required).length} required)
              </span>
            </div>
          )}

          {operation.security && operation.security.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[4rem]">Security:</span>
              <span className="text-xs">🔒 Required</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
