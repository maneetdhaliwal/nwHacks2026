import { executeCode, ExecutionResult } from './codeExecutor';

export interface TestCase {
  input: unknown[];
  expected: unknown;
  description?: string;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actual: unknown;
  executionResult: ExecutionResult;
}

export interface TestRunResult {
  results: TestResult[];
  allPassed: boolean;
  totalTime: number;
  passedCount: number;
  failedCount: number;
  logs: string[];
}

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  
  if (typeof a !== typeof b) return false;
  
  if (a === null || b === null) return a === b;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    
    if (aKeys.length !== bKeys.length) return false;
    
    return aKeys.every(key => 
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }
  
  return false;
};

export const runTests = (code: string, testCases: TestCase[]): TestRunResult => {
  const results: TestResult[] = [];
  const allLogs: string[] = [];
  let totalTime = 0;
  
  for (const testCase of testCases) {
    const executionResult = executeCode(code, testCase.input);
    totalTime += executionResult.executionTime;
    allLogs.push(...executionResult.logs);
    
    const passed = !executionResult.error && deepEqual(executionResult.result, testCase.expected);
    
    results.push({
      testCase,
      passed,
      actual: executionResult.result,
      executionResult,
    });
  }
  
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;
  
  return {
    results,
    allPassed: failedCount === 0,
    totalTime,
    passedCount,
    failedCount,
    logs: allLogs,
  };
};

export const formatTestInput = (input: unknown[]): string => {
  return input.map(arg => JSON.stringify(arg)).join(', ');
};

export const formatValue = (value: unknown): string => {
  return JSON.stringify(value);
};
