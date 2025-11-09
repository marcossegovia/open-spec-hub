'use client';

import { useState, useEffect } from 'react';
import { UnifiedOperation, UnifiedContract } from '@/lib/normalization/unified-model';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { generateCodeExample, CodeLanguage } from '@/lib/utils/code-generator';

// Import Prism.js for syntax highlighting
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';

interface CodeExamplesProps {
  operation: UnifiedOperation;
  contract: UnifiedContract;
}

export default function CodeExamples({ operation, contract }: CodeExamplesProps) {
  const isREST = operation.metadata.protocol === 'openapi';

  // Available languages based on protocol
  const availableLanguages: { value: CodeLanguage; label: string }[] = isREST
    ? [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'curl', label: 'cURL' },
      ]
    : [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
      ];

  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(availableLanguages[0].value);
  const [copied, setCopied] = useState(false);

  const code = generateCodeExample(operation, contract, selectedLanguage);

  // Apply syntax highlighting when code or language changes
  useEffect(() => {
    Prism.highlightAll();
  }, [code, selectedLanguage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">💻 Code Examples</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Tabs */}
        <div className="flex flex-wrap gap-2">
          {availableLanguages.map(lang => (
            <Badge
              key={lang.value}
              variant={selectedLanguage === lang.value ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-1.5"
              onClick={() => setSelectedLanguage(lang.value)}
            >
              {lang.label}
            </Badge>
          ))}
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code className={`language-${selectedLanguage === 'curl' ? 'bash' : selectedLanguage}`}>
              {code}
            </code>
          </pre>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground">
          {isREST ? (
            <p>
              This example shows how to call the <strong>{operation.actionType}</strong> operation.
              {operation.security && operation.security.length > 0 && (
                <> Remember to add your authentication token where indicated.</>
              )}
            </p>
          ) : (
            <p>
              This example shows how to {operation.actionType === 'PUBLISH' ? 'publish to' : 'subscribe to'} the{' '}
              <strong>{operation.location}</strong> channel.
              Update the broker URL and consumer group ID as needed.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
