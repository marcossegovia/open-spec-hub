'use client';

import { UnifiedContract, UnifiedOperation, ActionType } from '@/lib/normalization/unified-model';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  contracts: UnifiedContract[];
  operations: UnifiedOperation[];
  selectedOperationId?: string;
  onOperationSelect?: (operation: UnifiedOperation) => void;
  groupBy?: 'contract' | 'tag' | 'pattern';
}

const actionTypeColors: Record<ActionType, string> = {
  'GET': 'bg-blue-500',
  'POST': 'bg-green-500',
  'PUT': 'bg-yellow-500',
  'PATCH': 'bg-yellow-500',
  'DELETE': 'bg-red-500',
  'PUBLISH': 'bg-purple-500',
  'SUBSCRIBE': 'bg-orange-500',
};

export default function Sidebar({
  contracts,
  operations,
  selectedOperationId,
  onOperationSelect,
  groupBy = 'contract'
}: SidebarProps) {
  if (groupBy === 'contract') {
    return (
      <div className="space-y-4">
        <div className="px-4 py-2 border-b">
          <h2 className="font-semibold">Contracts</h2>
          <p className="text-xs text-muted-foreground">
            {contracts.length} contract{contracts.length !== 1 ? 's' : ''}
          </p>
        </div>
        {contracts.map(contract => (
          <ContractSection
            key={contract.id}
            contract={contract}
            selectedOperationId={selectedOperationId}
            onOperationSelect={onOperationSelect}
          />
        ))}
      </div>
    );
  }

  if (groupBy === 'tag') {
    const operationsByTag = new Map<string, UnifiedOperation[]>();

    operations.forEach(op => {
      if (op.tags.length === 0) {
        const untagged = operationsByTag.get('Untagged') || [];
        untagged.push(op);
        operationsByTag.set('Untagged', untagged);
      } else {
        op.tags.forEach(tag => {
          const tagged = operationsByTag.get(tag) || [];
          tagged.push(op);
          operationsByTag.set(tag, tagged);
        });
      }
    });

    return (
      <div className="space-y-4">
        <div className="px-4 py-2 border-b">
          <h2 className="font-semibold">By Category</h2>
          <p className="text-xs text-muted-foreground">
            {operationsByTag.size} categor{operationsByTag.size !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        {Array.from(operationsByTag.entries()).map(([tag, ops]) => (
          <div key={tag} className="px-4">
            <div className="font-medium text-sm mb-2">
              {tag}
              <span className="text-muted-foreground text-xs ml-2">
                ({ops.length})
              </span>
            </div>
            <div className="space-y-1">
              {ops.map(op => (
                <OperationItem
                  key={op.id}
                  operation={op}
                  selected={op.id === selectedOperationId}
                  onClick={() => onOperationSelect?.(op)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const syncOps = operations.filter(op => op.communicationPattern === 'request-response');
  const asyncOps = operations.filter(op => op.communicationPattern === 'publish-subscribe');

  return (
    <div className="space-y-4">
      <div className="px-4 py-2 border-b">
        <h2 className="font-semibold">By Pattern</h2>
      </div>
      {syncOps.length > 0 && (
        <div className="px-4">
          <div className="font-medium text-sm mb-2">
            ⇄ Request/Response
            <span className="text-muted-foreground text-xs ml-2">
              ({syncOps.length})
            </span>
          </div>
          <div className="space-y-1">
            {syncOps.map(op => (
              <OperationItem
                key={op.id}
                operation={op}
                selected={op.id === selectedOperationId}
                onClick={() => onOperationSelect?.(op)}
              />
            ))}
          </div>
        </div>
      )}
      {asyncOps.length > 0 && (
        <div className="px-4">
          <div className="font-medium text-sm mb-2">
            ⇉ Publish/Subscribe
            <span className="text-muted-foreground text-xs ml-2">
              ({asyncOps.length})
            </span>
          </div>
          <div className="space-y-1">
            {asyncOps.map(op => (
              <OperationItem
                key={op.id}
                operation={op}
                selected={op.id === selectedOperationId}
                onClick={() => onOperationSelect?.(op)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContractSection({
  contract,
  selectedOperationId,
  onOperationSelect
}: {
  contract: UnifiedContract;
  selectedOperationId?: string;
  onOperationSelect?: (operation: UnifiedOperation) => void;
}) {
  return (
    <div className="px-4">
      <div className="mb-2">
        <div className="font-medium text-sm">{contract.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {contract.protocol === 'openapi' ? '🔷 REST' : '🟣 Event'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            v{contract.version}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        {contract.operations.map(operation => (
          <OperationItem
            key={operation.id}
            operation={operation}
            selected={operation.id === selectedOperationId}
            onClick={() => onOperationSelect?.(operation)}
          />
        ))}
      </div>
    </div>
  );
}

function OperationItem({
  operation,
  selected,
  onClick
}: {
  operation: UnifiedOperation;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        selected
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`w-1 h-1 mt-1.5 rounded-full flex-shrink-0 ${
            actionTypeColors[operation.actionType]
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${selected ? '' : 'text-foreground'}`}>
            {operation.name}
          </div>
          <div className={`text-xs font-mono truncate ${
            selected ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}>
            {operation.location}
          </div>
        </div>
        <Badge
          variant={selected ? 'secondary' : 'outline'}
          className="text-xs flex-shrink-0"
        >
          {operation.actionType}
        </Badge>
      </div>
    </button>
  );
}
