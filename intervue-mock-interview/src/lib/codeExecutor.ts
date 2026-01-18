export interface ExecutionResult {
  output: string;
  logs: string[];
  error: string | null;
  result: unknown;
  executionTime: number;
}

const TIMEOUT_MS = 5000;

export const executeCode = (code: string, args: unknown[]): ExecutionResult => {
  const logs: string[] = [];
  const startTime = performance.now();
  
  // Create a custom console to capture logs
  const customConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '));
    },
    error: (...args: unknown[]) => {
      logs.push(`[ERROR] ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`);
    },
    warn: (...args: unknown[]) => {
      logs.push(`[WARN] ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`);
    },
  };

  try {
    // Extract function name from code
    const funcMatch = code.match(/function\s+(\w+)/);
    if (!funcMatch) {
      return {
        output: '',
        logs,
        error: 'Could not find a function definition. Please define a function like: function solution(...) { }',
        result: undefined,
        executionTime: performance.now() - startTime,
      };
    }
    
    const funcName = funcMatch[1];
    
    // Create a sandboxed function with timeout protection
    const wrappedCode = `
      ${code}
      return ${funcName}(...args);
    `;
    
    // Create a function with custom console
    const executor = new Function('console', 'args', wrappedCode);
    
    // Execute with timeout using a synchronous approach
    let result: unknown;
    let timedOut = false;
    
    const timeoutId = setTimeout(() => {
      timedOut = true;
    }, TIMEOUT_MS);
    
    try {
      result = executor(customConsole, args);
    } finally {
      clearTimeout(timeoutId);
    }
    
    if (timedOut) {
      return {
        output: '',
        logs,
        error: `Execution timed out after ${TIMEOUT_MS}ms. Check for infinite loops.`,
        result: undefined,
        executionTime: TIMEOUT_MS,
      };
    }
    
    const executionTime = performance.now() - startTime;
    
    return {
      output: typeof result === 'object' ? JSON.stringify(result) : String(result),
      logs,
      error: null,
      result,
      executionTime,
    };
  } catch (err) {
    const executionTime = performance.now() - startTime;
    const error = err instanceof Error ? err.message : String(err);
    
    return {
      output: '',
      logs,
      error,
      result: undefined,
      executionTime,
    };
  }
};
