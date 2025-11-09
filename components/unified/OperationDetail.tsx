'use client';

import { useState, useEffect } from 'react';
import { UnifiedOperation, UnifiedContract } from '@/lib/normalization/unified-model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import DataSchema from './DataSchema';
import CodeExamples from './CodeExamples';
import { SchemaDisplay } from './SchemaDisplay';
import { useTheme } from '@/components/theme-provider';

// Import highlight.js for syntax highlighting
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';

// Register languages
hljs.registerLanguage('javascript', javascript);

interface OperationDetailProps {
  operation: UnifiedOperation;
  contract?: UnifiedContract;
}

const actionTypeColors: Record<string, string> = {
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

const patternLabels: Record<string, string> = {
  'request-response': 'Request/Response',
  'publish-subscribe': 'Publish/Subscribe',
};

export default function OperationDetail({ operation, contract }: OperationDetailProps) {
  const { resolvedTheme } = useTheme();
  const [copiedExample, setCopiedExample] = useState<string | null>(null);
  const hasInput = !!operation.input;
  const hasOutput = operation.output && operation.output.length > 0;
  const hasParameters = operation.parameters.length > 0;

  // Manage highlight.js theme CSS for JSON examples
  useEffect(() => {
    const updateHighlightTheme = () => {
      const existingThemeLink = document.querySelector('link[data-highlight-theme-json]');
      if (existingThemeLink) {
        existingThemeLink.remove();
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-highlight-theme-json', 'true');
      
      if (resolvedTheme === 'dark') {
        link.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/an-old-hope.css';
      } else {
        link.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/vs.css';
      }
      
      document.head.appendChild(link);
    };

    updateHighlightTheme();
  }, [resolvedTheme]);

  // Apply syntax highlighting when component mounts or theme changes
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      if (block instanceof HTMLElement) {
        hljs.highlightElement(block);
      }
    });
  }, [resolvedTheme]);

  // Handle copying examples with icon feedback
  const handleCopyExample = async (example: any, type: string) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(example, null, 2));
      setCopiedExample(type);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${actionTypeColors[operation.actionType]} text-white border-none`}>
                  {operation.actionType}
                </Badge>
                <span
                  className="text-xl"
                  title={patternLabels[operation.communicationPattern]}
                >
                  {patternIcons[operation.communicationPattern]}
                </span>
                {contract && (
                  <Badge variant="outline">
                    {contract.protocol === 'openapi' ? '🔷 REST' : '🟣 Event'}
                  </Badge>
                )}
              </div>

              <CardTitle className="text-2xl">{operation.name}</CardTitle>

              <CardDescription className="font-mono text-sm">
                {operation.location}
              </CardDescription>

              {operation.description && (
                <p className="text-muted-foreground">{operation.description}</p>
              )}

              {operation.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {operation.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {contract && (
          <CardContent className="border-t">
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Contract:</span>
                <span>{contract.name}</span>
                <Badge variant="outline" className="text-xs">
                  v{contract.version}
                </Badge>
              </div>
              {contract.description && (
                <p className="text-muted-foreground">{contract.description}</p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Parameters */}
      {hasParameters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parameters</CardTitle>
            <CardDescription>
              {operation.parameters.filter(p => p.required).length} required,{' '}
              {operation.parameters.filter(p => !p.required).length} optional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {operation.parameters.map(param => (
                <div
                  key={param.name}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-semibold">{param.name}</code>
                      {param.required && (
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {param.location}
                      </Badge>
                      <code className="text-xs text-muted-foreground">
                        {param.type}
                        {param.format && `:${param.format}`}
                      </code>
                    </div>
                  </div>

                  {param.description && (
                    <p className="text-sm text-muted-foreground">
                      {param.description}
                    </p>
                  )}

                  {(param.example !== undefined || param.default !== undefined || param.enum) && (
                    <div className="text-xs space-y-1">
                      {param.default !== undefined && (
                        <div>
                          <span className="font-medium">Default:</span>{' '}
                          <code className="bg-muted px-1 py-0.5 rounded">
                            {JSON.stringify(param.default)}
                          </code>
                        </div>
                      )}
                      {param.example !== undefined && (
                        <div>
                          <span className="font-medium">Example:</span>{' '}
                          <code className="bg-muted px-1 py-0.5 rounded">
                            {JSON.stringify(param.example)}
                          </code>
                        </div>
                      )}
                      {param.enum && (
                        <div>
                          <span className="font-medium">Allowed values:</span>{' '}
                          <span className="space-x-1">
                            {param.enum.map((val, idx) => (
                              <code key={idx} className="bg-muted px-1 py-0.5 rounded">
                                {JSON.stringify(val)}
                              </code>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Schema */}
      {hasInput && (
        <Card>
          <CardHeader>
            <CardDescription>
              Data sent with this operation
              {operation.input!.contentType && (
                <span className="ml-2">
                  (<code className="text-xs">{operation.input!.contentType}</code>)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Schema Display with tabs */}
            <SchemaDisplay
              schema={operation.input!}
              title="Input Schema"
              theme={resolvedTheme}
            />

            {/* Example Request - kept separate */}
            {operation.input!.example !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Example Request</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyExample(operation.input!.example, 'request')}
                    className="gap-2"
                  >
                    {copiedExample === 'request' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm" key={`request-${JSON.stringify(operation.input!.example).slice(0, 30)}`}>
                  <code className="language-javascript">{JSON.stringify(operation.input!.example, null, 2)}</code>
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Output Schemas */}
      {hasOutput && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Output</h3>
          {operation.output!.map((output, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {output.statusCode
                      ? `Response ${output.statusCode}`
                      : output.name || 'Response'
                    }
                  </CardTitle>
                  {output.contentType && (
                    <code className="text-xs text-muted-foreground">
                      {output.contentType}
                    </code>
                  )}
                </div>
                {output.description && (
                  <CardDescription>{output.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Schema Display with tabs */}
                <SchemaDisplay
                  schema={output}
                  title="Output Schema"
                  theme={resolvedTheme}
                />

                {/* Example Response - kept separate */}
                {output.example !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">Example Response</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyExample(output.example, `response-${output.statusCode}`)}
                        className="gap-2"
                      >
                        {copiedExample === `response-${output.statusCode}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm" key={`response-${output.statusCode}-${JSON.stringify(output.example).slice(0, 30)}`}>
                      <code className="language-javascript">{JSON.stringify(output.example, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Code Examples */}
      {contract && <CodeExamples operation={operation} contract={contract} />}

      {/* Security */}
      {operation.security && operation.security.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔒 Security</CardTitle>
            <CardDescription>
              This operation requires authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {operation.security.map(scheme => (
                <div key={scheme} className="flex items-center gap-2">
                  <Badge variant="outline">{scheme}</Badge>
                  {contract?.securitySchemes?.[scheme] && (
                    <span className="text-sm text-muted-foreground">
                      ({contract.securitySchemes[scheme].type})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Protocol-Specific Metadata */}
      {operation.metadata.rest && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">REST Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">HTTP Method:</span>{' '}
              <code>{operation.metadata.rest.method.toUpperCase()}</code>
            </div>
            <div>
              <span className="font-medium">Path:</span>{' '}
              <code>{operation.metadata.rest.path}</code>
            </div>
            {operation.metadata.operationId && (
              <div>
                <span className="font-medium">Operation ID:</span>{' '}
                <code>{operation.metadata.operationId}</code>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {operation.metadata.async && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Channel:</span>{' '}
              <code>{operation.metadata.async.channel}</code>
            </div>
            <div>
              <span className="font-medium">Action:</span>{' '}
              <Badge variant="outline">{operation.metadata.async.action}</Badge>
            </div>
            {operation.metadata.async.bindings && (
              <div>
                <span className="font-medium">Protocol Bindings:</span>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {JSON.stringify(operation.metadata.async.bindings, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
