'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { UnifiedDataSchema } from '@/lib/normalization/unified-model';
import DataSchema from './DataSchema';
import { cn } from '@/lib/utils';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

// Register JSON language for syntax highlighting
hljs.registerLanguage('json', json);

interface SchemaDisplayProps {
  schema: UnifiedDataSchema;
  title: string;
  theme?: 'light' | 'dark' | 'system';
}

export function SchemaDisplay({ schema, title, theme = 'light' }: SchemaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'original'>('schema');
  const [copied, setCopied] = useState(false);

  // Apply syntax highlighting when switching to "Original Schema" tab
  useEffect(() => {
    if (activeTab === 'original') {
      const codeBlocks = document.querySelectorAll('.schema-original-code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [activeTab, theme]);

  const copyOriginalSchema = () => {
    if (!schema.originalSchema) return;

    const formatted = JSON.stringify(schema.originalSchema, null, 2);
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header with title and tab buttons */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Tab buttons - only show if originalSchema exists */}
        {schema.originalSchema && (
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('schema')}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                activeTab === 'schema'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              Schema
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                activeTab === 'original'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              Original Schema
            </button>
          </div>
        )}
      </div>

      {/* Tab content */}
      {activeTab === 'schema' && (
        <div className="border rounded-lg p-4">
          <DataSchema schema={schema} />
        </div>
      )}

      {activeTab === 'original' && schema.originalSchema && (
        <div className="space-y-2">
          {/* Schema format badge and copy button */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {schema.schemaFormat === 'avro' ? 'Avro Schema' : 'JSON Schema'}
            </span>
            <button
              onClick={copyOriginalSchema}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md hover:bg-accent transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Schema
                </>
              )}
            </button>
          </div>

          {/* Original schema with syntax highlighting */}
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
            <code className="schema-original-code language-json text-sm">
              {JSON.stringify(schema.originalSchema, null, 2)}
            </code>
          </pre>

          {/* Show namespace for Avro schemas */}
          {schema.metadata?.namespace && (
            <p className="text-sm text-muted-foreground">
              Namespace: <code className="px-1 py-0.5 bg-muted rounded">{schema.metadata.namespace}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
