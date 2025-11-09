'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ActionType } from '@/lib/normalization/unified-model';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  availableTags?: string[];
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  availableActionTypes?: ActionType[];
  selectedActionTypes?: ActionType[];
  onActionTypeToggle?: (actionType: ActionType) => void;
  showFilters?: boolean;
}

const actionTypeColors: Record<ActionType, string> = {
  'GET': 'border-blue-500 text-blue-700 hover:bg-blue-50',
  'POST': 'border-green-500 text-green-700 hover:bg-green-50',
  'PUT': 'border-yellow-500 text-yellow-700 hover:bg-yellow-50',
  'PATCH': 'border-yellow-500 text-yellow-700 hover:bg-yellow-50',
  'DELETE': 'border-red-500 text-red-700 hover:bg-red-50',
  'PUBLISH': 'border-purple-500 text-purple-700 hover:bg-purple-50',
  'SUBSCRIBE': 'border-orange-500 text-orange-700 hover:bg-orange-50',
};

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search operations...',
  availableTags = [],
  selectedTags = [],
  onTagToggle,
  availableActionTypes = [],
  selectedActionTypes = [],
  onActionTypeToggle,
  showFilters = true
}: SearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = selectedTags.length > 0 || selectedActionTypes.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
        {showFilters && (
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
          >
            {showAdvanced ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && !showAdvanced && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 justify-center">
                {selectedTags.length + selectedActionTypes.length}
              </Badge>
            )}
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvanced && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          {/* Action Type Filters */}
          {availableActionTypes.length > 0 && onActionTypeToggle && (
            <div>
              <div className="text-sm font-medium mb-2">Action Types</div>
              <div className="flex flex-wrap gap-2">
                {availableActionTypes.map(actionType => {
                  const isSelected = selectedActionTypes.includes(actionType);
                  return (
                    <Badge
                      key={actionType}
                      variant="outline"
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? actionTypeColors[actionType]
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => onActionTypeToggle(actionType)}
                    >
                      {actionType}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tag Filters */}
          {availableTags.length > 0 && onTagToggle && (
            <div>
              <div className="text-sm font-medium mb-2">Categories</div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => onTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-2 border-t">
              <button
                onClick={() => {
                  selectedTags.forEach(tag => onTagToggle?.(tag));
                  selectedActionTypes.forEach(at => onActionTypeToggle?.(at));
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary (when collapsed) */}
      {showFilters && !showAdvanced && hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedActionTypes.map(actionType => (
            <Badge
              key={actionType}
              variant="outline"
              className={`cursor-pointer ${actionTypeColors[actionType]}`}
              onClick={() => onActionTypeToggle?.(actionType)}
            >
              {actionType} ×
            </Badge>
          ))}
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="default"
              className="cursor-pointer"
              onClick={() => onTagToggle?.(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
