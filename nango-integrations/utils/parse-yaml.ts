// @ts-nocheck

export function parseYaml(yamlString: string): Record<string, any> {
    const lines = yamlString.split('\n');
    const result: Record<string, any> = {};
    const stack: any[] = [result];  // Stack to handle nested objects
    let currentIndentation = 0;

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (trimmedLine === '' || trimmedLine.startsWith('#')) {
            continue;
        }

        const indentation = line.match(/^(\s*)/)?.[0].length || 0;

        // If the current line has less indentation, move up the stack
        if (indentation < currentIndentation) {
            while (stack.length > 1 && currentIndentation > indentation) {
                stack.pop();
                currentIndentation -= 2;  // Assuming 2-space indentation
            }
        }

        // Handle key-value pairs
        if (trimmedLine.includes(':')) {
            const [key, value] = trimmedLine.split(':').map(item => item.trim());

            // Handle arrays (key: '- value')
            if (value === '') {
                // Start a new object or array based on indentation
                const newObject: Record<string, any> = {};
                stack[stack.length - 1][key] = newObject;
                stack.push(newObject);
                currentIndentation = indentation + 2;
            } else if (value.startsWith('-')) {
                const arrayKey = key;
                const arrayValues = value.split('-').map(item => item.trim()).filter(Boolean);
                stack[stack.length - 1][arrayKey] = arrayValues;
            } else {
                // Regular key-value pair
                stack[stack.length - 1][key] = value || null;
            }
        }
    }

    return result;
}
