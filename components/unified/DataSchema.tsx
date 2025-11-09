'use client';

import { UnifiedDataSchema, SchemaProperty } from '@/lib/normalization/unified-model';
import { Badge } from '@/components/ui/badge';

interface DataSchemaProps {
  schema: UnifiedDataSchema;
  level?: number;
  hideRootExample?: boolean; // Hide example at root level (shown separately in OperationDetail)
}

export default function DataSchema({ schema, level = 0, hideRootExample = false }: DataSchemaProps) {
  const indent = level * 16;

  if (schema.type === 'array' && schema.items) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            array
          </Badge>
          {schema.description && (
            <span className="text-sm text-muted-foreground">
              {schema.description}
            </span>
          )}
        </div>
        <div className="ml-4 border-l-2 pl-4">
          <div className="text-sm text-muted-foreground mb-2">Items:</div>
          <DataSchema schema={schema.items} level={level + 1} />
        </div>
        {schema.validation && (
          <div className="text-xs text-muted-foreground space-x-2">
            {schema.validation.minItems !== undefined && (
              <span>min: {schema.validation.minItems}</span>
            )}
            {schema.validation.maxItems !== undefined && (
              <span>max: {schema.validation.maxItems}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  if (schema.type === 'object' && schema.properties) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {schema.name && (
            <div className="font-semibold text-sm">{schema.name}</div>
          )}
          {schema.schemaFormat === 'avro' && (
            <Badge variant="secondary" className="text-xs">
              Avro Record
            </Badge>
          )}
        </div>
        {schema.description && (
          <p className="text-sm text-muted-foreground">{schema.description}</p>
        )}
        <div className="space-y-2">
          {Object.entries(schema.properties).map(([propName, prop]) => (
            <SchemaPropertyView
              key={propName}
              name={propName}
              property={prop}
              required={schema.required?.includes(propName)}
              level={level}
              isAvro={schema.schemaFormat === 'avro'}
            />
          ))}
        </div>
        {schema.example !== undefined && !hideRootExample && level > 0 && (
          <div className="mt-3">
            <div className="text-xs font-medium mb-1">Example:</div>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(schema.example, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs font-mono">
          {schema.type}
        </Badge>
        {schema.format && (
          <Badge variant="secondary" className="text-xs">
            {schema.format}
          </Badge>
        )}
        {schema.description && (
          <span className="text-sm text-muted-foreground">
            {schema.description}
          </span>
        )}
      </div>

      {schema.enum && (
        <div className="text-xs">
          <span className="font-medium">Allowed values:</span>{' '}
          <span className="space-x-1">
            {schema.enum.map((val, idx) => (
              <code key={idx} className="bg-muted px-1 py-0.5 rounded">
                {JSON.stringify(val)}
              </code>
            ))}
          </span>
        </div>
      )}

      {schema.validation && (
        <div className="text-xs text-muted-foreground space-x-3">
          {schema.validation.minimum !== undefined && (
            <span>min: {schema.validation.minimum}</span>
          )}
          {schema.validation.maximum !== undefined && (
            <span>max: {schema.validation.maximum}</span>
          )}
          {schema.validation.minLength !== undefined && (
            <span>minLength: {schema.validation.minLength}</span>
          )}
          {schema.validation.maxLength !== undefined && (
            <span>maxLength: {schema.validation.maxLength}</span>
          )}
          {schema.validation.pattern && (
            <span>pattern: <code>{schema.validation.pattern}</code></span>
          )}
        </div>
      )}

      {schema.example !== undefined && (
        <div>
          <span className="text-xs font-medium">Example:</span>{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            {JSON.stringify(schema.example)}
          </code>
        </div>
      )}
    </div>
  );
}

function SchemaPropertyView({
  name,
  property,
  required,
  level,
  isAvro = false
}: {
  name: string;
  property: SchemaProperty;
  required?: boolean;
  level: number;
  isAvro?: boolean;
}) {
  const hasNested = property.type === 'object' && property.properties;
  const isArray = property.type === 'array' && property.items;

  return (
    <div className="border rounded-lg p-3 space-y-2">
      {/* Property Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <code className="text-sm font-semibold">{name}</code>
          {required && (
            <Badge variant="destructive" className="text-xs">
              required
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {property.type}
          </Badge>
          {isAvro && (
            <Badge variant="secondary" className="text-xs">
              Avro
            </Badge>
          )}
          {property.format && (
            <Badge variant="secondary" className="text-xs">
              {property.format}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <p className="text-sm text-muted-foreground">{property.description}</p>
      )}

      {/* Special handling for Avro maps */}
      {isAvro && property.type === 'object' && !property.properties && (
        <div className="text-xs text-muted-foreground">
          <span>🗺️ Map structure (key-value pairs)</span>
        </div>
      )}

      {/* Enum */}
      {property.enum && (
        <div className="text-xs">
          <span className="font-medium">Allowed values:</span>{' '}
          <span className="space-x-1">
            {property.enum.map((val, idx) => (
              <code key={idx} className="bg-muted px-1 py-0.5 rounded">
                {JSON.stringify(val)}
              </code>
            ))}
          </span>
        </div>
      )}

      {/* Validation */}
      {property.validation && (
        <div className="text-xs text-muted-foreground space-x-3">
          {property.validation.minimum !== undefined && (
            <span>min: {property.validation.minimum}</span>
          )}
          {property.validation.maximum !== undefined && (
            <span>max: {property.validation.maximum}</span>
          )}
          {property.validation.minLength !== undefined && (
            <span>minLength: {property.validation.minLength}</span>
          )}
          {property.validation.maxLength !== undefined && (
            <span>maxLength: {property.validation.maxLength}</span>
          )}
          {property.validation.pattern && (
            <span>pattern: <code>{property.validation.pattern}</code></span>
          )}
        </div>
      )}

      {/* Example */}
      {property.example !== undefined && (
        <div className="text-xs">
          <span className="font-medium">Example:</span>{' '}
          <code className="bg-muted px-1 py-0.5 rounded">
            {JSON.stringify(property.example)}
          </code>
        </div>
      )}

      {/* Nested Object Properties */}
      {hasNested && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 pl-4">
          {Object.entries(property.properties!).map(([nestedName, nestedProp]) => (
            <SchemaPropertyView
              key={nestedName}
              name={nestedName}
              property={nestedProp}
              required={nestedProp.required}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {/* Array Items */}
      {isArray && (
        <div className="ml-4 mt-2 border-l-2 pl-4">
          <div className="text-xs text-muted-foreground mb-2">Array items:</div>
          <SchemaPropertyView
            name="item"
            property={property.items!}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}
