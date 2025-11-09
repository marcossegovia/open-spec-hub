/**
 * Code Example Generator
 *
 * Generates production-ready code examples for REST and AsyncAPI operations
 */

import { UnifiedOperation, UnifiedContract } from '@/lib/normalization/unified-model';

export type CodeLanguage = 'javascript' | 'python' | 'curl' | 'java';

/**
 * Generate code example for an operation
 */
export function generateCodeExample(
  operation: UnifiedOperation,
  contract: UnifiedContract,
  language: CodeLanguage
): string {
  // Determine if this is a REST or AsyncAPI operation
  const isREST = operation.metadata.protocol === 'openapi';

  if (isREST) {
    return generateRESTExample(operation, contract, language);
  } else {
    return generateAsyncAPIExample(operation, contract, language);
  }
}

/**
 * Extract parameter example values from operation responses
 */
function extractParameterExample(operation: UnifiedOperation, paramName: string): string {
  // Check if parameter has a defined example
  const paramDef = operation.parameters.find(p => p.name === paramName);
  if (paramDef?.example) {
    return String(paramDef.example);
  }

  // Extract examples from response schemas based on common patterns
  if (operation.output && operation.output.length > 0) {
    for (const output of operation.output) {
      if (output.example) {
        // Look for matching ID patterns in response examples
        const exampleStr = JSON.stringify(output.example);
        
        // Common parameter patterns and their example values
        const patterns: Record<string, RegExp> = {
          'productId': /"productId":\s*"([^"]+)"/,
          'userId': /"userId":\s*"([^"]+)"/,
          'orderId': /"orderId":\s*"([^"]+)"/,
          'id': /"id":\s*"([^"]+)"/
        };

        for (const [patternName, regex] of Object.entries(patterns)) {
          if (paramName === patternName || paramName.includes(patternName)) {
            const match = exampleStr.match(regex);
            if (match && match[1]) {
              return match[1];
            }
          }
        }
      }
    }
  }

  // Fallback to sensible defaults based on parameter name and type
  const paramType = paramDef?.type || 'string';
  const paramNameLower = paramName.toLowerCase();
  
  if (paramNameLower.includes('id')) {
    if (paramType === 'string' && paramDef?.format === 'uuid') {
      return '123e4567-e89b-12d3-a456-426614174000';
    }
    return '123';
  }
  
  if (paramNameLower.includes('page')) return '1';
  if (paramNameLower.includes('limit')) return '20';
  if (paramNameLower.includes('query')) return 'search';
  
  return `{${paramName}}`;
}

/**
 * Generate REST API code examples
 */
function generateRESTExample(
  operation: UnifiedOperation,
  contract: UnifiedContract,
  language: CodeLanguage
): string {
  const method = operation.metadata.rest?.method.toUpperCase() || 'GET';
  const path = operation.metadata.rest?.path || operation.location;
  const serverUrl = contract.servers?.[0]?.url || 'https://api.example.com';
  const fullUrl = `${serverUrl}${path}`;

  // Replace path parameters with example values
  const urlWithParams = fullUrl.replace(/\{([^}]+)\}/g, (_, param: string) => {
    const paramDef = operation.parameters.find(p => p.name === param);
    return extractParameterExample(operation, param);
  });

  switch (language) {
    case 'javascript':
      return generateJavaScriptFetch(operation, method, urlWithParams);
    case 'python':
      return generatePythonRequests(operation, method, urlWithParams);
    case 'curl':
      return generateCurl(operation, method, urlWithParams);
    default:
      return '// Code example not available for this language';
  }
}

/**
 * Generate JavaScript fetch example
 */
function generateJavaScriptFetch(
  operation: UnifiedOperation,
  method: string,
  url: string
): string {
  const hasInput = !!operation.input;
  const functionName = operation.id.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');

  let code = `// ${operation.name}\n`;
  code += `async function ${functionName}(`;

  if (hasInput) {
    code += 'data';
  }

  code += `) {\n`;
  code += `  const response = await fetch('${url}', {\n`;
  code += `    method: '${method}',\n`;
  code += `    headers: {\n`;
  code += `      'Content-Type': 'application/json',\n`;

  if (operation.security && operation.security.length > 0) {
    code += `      // Add authentication header\n`;
    code += `      // 'Authorization': 'Bearer YOUR_TOKEN'\n`;
  }

  code += `    }`;

  if (hasInput) {
    code += `,\n    body: JSON.stringify(data)`;
  }

  code += `\n  });\n\n`;
  code += `  if (!response.ok) {\n`;
  code += `    throw new Error(\`HTTP error! status: \${response.status}\`);\n`;
  code += `  }\n\n`;

  const hasOutput = operation.output && operation.output.length > 0 && operation.output[0].type !== 'null';

  if (hasOutput) {
    code += `  const result = await response.json();\n`;
    code += `  return result;\n`;
  } else {
    code += `  return response;\n`;
  }

  code += `}\n\n`;

  // Add example usage
  code += `// Example usage:\n`;
  if (hasInput && operation.input?.example) {
    code += `const result = await ${functionName}(${JSON.stringify(operation.input.example, null, 2)});\n`;
  } else if (hasInput) {
    code += `const result = await ${functionName}({ /* your data here */ });\n`;
  } else {
    code += `const result = await ${functionName}();\n`;
  }
  code += `console.log(result);`;

  return code;
}

/**
 * Generate Python requests example
 */
function generatePythonRequests(
  operation: UnifiedOperation,
  method: string,
  url: string
): string {
  const hasInput = !!operation.input;
  const functionName = operation.id.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');

  let code = `import requests\nimport json\n\n`;
  code += `# ${operation.name}\n`;
  code += `def ${functionName}(`;

  if (hasInput) {
    code += 'data';
  }

  code += `):\n`;
  code += `    url = "${url}"\n`;
  code += `    headers = {\n`;
  code += `        "Content-Type": "application/json",\n`;

  if (operation.security && operation.security.length > 0) {
    code += `        # Add authentication header\n`;
    code += `        # "Authorization": "Bearer YOUR_TOKEN"\n`;
  }

  code += `    }\n\n`;

  if (hasInput) {
    code += `    response = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`;
  } else {
    code += `    response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
  }

  code += `    response.raise_for_status()  # Raise exception for bad status codes\n\n`;

  const hasOutput = operation.output && operation.output.length > 0 && operation.output[0].type !== 'null';

  if (hasOutput) {
    code += `    return response.json()\n\n`;
  } else {
    code += `    return response\n\n`;
  }

  // Add example usage
  code += `# Example usage:\n`;
  if (hasInput && operation.input?.example) {
    code += `data = ${JSON.stringify(operation.input.example, null, 4).replace(/"/g, "'")}\n`;
    code += `result = ${functionName}(data)\n`;
  } else if (hasInput) {
    code += `result = ${functionName}({ "key": "value" })\n`;
  } else {
    code += `result = ${functionName}()\n`;
  }
  code += `print(result)`;

  return code;
}

/**
 * Generate cURL example
 */
function generateCurl(
  operation: UnifiedOperation,
  method: string,
  url: string
): string {
  let code = `# ${operation.name}\n`;
  code += `curl -X ${method} "${url}" \\\n`;
  code += `  -H "Content-Type: application/json"`;

  if (operation.security && operation.security.length > 0) {
    code += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN"`;
  }

  if (operation.input) {
    code += ` \\\n  -d '`;
    if (operation.input.example) {
      code += JSON.stringify(operation.input.example, null, 2);
    } else {
      code += '{ "key": "value" }';
    }
    code += `'`;
  }

  return code;
}

/**
 * Generate AsyncAPI code examples
 */
function generateAsyncAPIExample(
  operation: UnifiedOperation,
  contract: UnifiedContract,
  language: CodeLanguage
): string {
  const action = operation.metadata.async?.action || 'send';
  const channel = operation.metadata.async?.channel || operation.location;
  const serverUrl = contract.servers?.[0]?.url || 'kafka.example.com:9092';

  switch (language) {
    case 'javascript':
      return generateKafkaJS(operation, action, channel, serverUrl);
    case 'python':
      return generateKafkaPython(operation, action, channel, serverUrl);
    default:
      return '// AsyncAPI code examples available in JavaScript and Python';
  }
}

/**
 * Generate KafkaJS example
 */
function generateKafkaJS(
  operation: UnifiedOperation,
  action: string,
  channel: string,
  serverUrl: string
): string {
  const isPublish = action === 'send';

  let code = `const { Kafka } = require('kafkajs');\n\n`;
  code += `// ${operation.name}\n`;
  code += `const kafka = new Kafka({\n`;
  code += `  clientId: 'my-app',\n`;
  code += `  brokers: ['${serverUrl}']\n`;
  code += `});\n\n`;

  if (isPublish) {
    code += `async function publishEvent(event) {\n`;
    code += `  const producer = kafka.producer();\n`;
    code += `  await producer.connect();\n\n`;
    code += `  await producer.send({\n`;
    code += `    topic: '${channel}',\n`;
    code += `    messages: [\n`;
    code += `      { value: JSON.stringify(event) }\n`;
    code += `    ]\n`;
    code += `  });\n\n`;
    code += `  await producer.disconnect();\n`;
    code += `  console.log('Event published successfully');\n`;
    code += `}\n\n`;
    code += `// Example usage:\n`;

    if (operation.input?.example) {
      code += `const event = ${JSON.stringify(operation.input.example, null, 2)};\n`;
    } else {
      code += `const event = { /* your event data */ };\n`;
    }
    code += `publishEvent(event).catch(console.error);`;
  } else {
    code += `async function subscribeToEvents() {\n`;
    code += `  const consumer = kafka.consumer({ groupId: 'my-group' });\n`;
    code += `  await consumer.connect();\n`;
    code += `  await consumer.subscribe({ topic: '${channel}', fromBeginning: false });\n\n`;
    code += `  await consumer.run({\n`;
    code += `    eachMessage: async ({ topic, partition, message }) => {\n`;
    code += `      const event = JSON.parse(message.value.toString());\n`;
    code += `      console.log('Received event:', event);\n\n`;
    code += `      // Process your event here\n`;
    code += `      await processEvent(event);\n`;
    code += `    }\n`;
    code += `  });\n`;
    code += `}\n\n`;
    code += `async function processEvent(event) {\n`;
    code += `  // Add your business logic here\n`;
    code += `  console.log('Processing:', event);\n`;
    code += `}\n\n`;
    code += `// Start subscriber:\n`;
    code += `subscribeToEvents().catch(console.error);`;
  }

  return code;
}

/**
 * Generate kafka-python example
 */
function generateKafkaPython(
  operation: UnifiedOperation,
  action: string,
  channel: string,
  serverUrl: string
): string {
  const isPublish = action === 'send';

  if (isPublish) {
    let code = `from kafka import KafkaProducer\nimport json\n\n`;
    code += `# ${operation.name}\n`;
    code += `producer = KafkaProducer(\n`;
    code += `    bootstrap_servers=['${serverUrl}'],\n`;
    code += `    value_serializer=lambda v: json.dumps(v).encode('utf-8')\n`;
    code += `)\n\n`;
    code += `def publish_event(event):\n`;
    code += `    future = producer.send('${channel}', event)\n`;
    code += `    result = future.get(timeout=10)\n`;
    code += `    print(f"Event published to partition {result.partition}")\n\n`;
    code += `# Example usage:\n`;

    if (operation.input?.example) {
      code += `event = ${JSON.stringify(operation.input.example, null, 4).replace(/"/g, "'")}\n`;
    } else {
      code += `event = { 'key': 'value' }\n`;
    }
    code += `publish_event(event)\n`;
    code += `producer.close()`;

    return code;
  } else {
    let code = `from kafka import KafkaConsumer\nimport json\n\n`;
    code += `# ${operation.name}\n`;
    code += `consumer = KafkaConsumer(\n`;
    code += `    '${channel}',\n`;
    code += `    bootstrap_servers=['${serverUrl}'],\n`;
    code += `    group_id='my-group',\n`;
    code += `    value_deserializer=lambda m: json.loads(m.decode('utf-8')),\n`;
    code += `    auto_offset_reset='latest'\n`;
    code += `)\n\n`;
    code += `print("Subscribed to ${channel}...")\n\n`;
    code += `for message in consumer:\n`;
    code += `    event = message.value\n`;
    code += `    print(f"Received event: {event}")\n\n`;
    code += `    # Process your event here\n`;
    code += `    process_event(event)\n\n`;
    code += `def process_event(event):\n`;
    code += `    # Add your business logic here\n`;
    code += `    pass`;

    return code;
  }
}
