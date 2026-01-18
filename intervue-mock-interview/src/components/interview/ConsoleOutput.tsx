import { cn } from "@/lib/utils";
import { Terminal, CheckCircle, XCircle, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { TestRunResult, formatTestInput, formatValue } from "@/lib/testRunner";
import { useState } from "react";

interface ConsoleOutputProps {
  testResult: TestRunResult | null;
  className?: string;
}

const ConsoleOutput = ({ testResult, className }: ConsoleOutputProps) => {
  const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

  const toggleTest = (index: number) => {
    setExpandedTests(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={cn("bg-background/50 border border-border rounded-lg", className)}>
      <div className="flex items-center gap-2 px-3 py-2 border-border border-b">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Console</span>
        {testResult && (
          <div className="flex items-center gap-2 ml-auto">
            <span className={cn(
              "font-medium text-xs",
              testResult.allPassed ? "text-green-500" : "text-destructive"
            )}>
              {testResult.passedCount}/{testResult.results.length} passed
            </span>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              {testResult.totalTime.toFixed(1)}ms
            </div>
          </div>
        )}
      </div>
      <div className="p-3 max-h-48 overflow-auto font-mono text-sm">
        {testResult ? (
          <div className="space-y-2">
            {/* Console logs from user code */}
            {testResult.logs.length > 0 && (
              <div className="mb-3 pb-2 border-border border-b">
                <div className="mb-1 text-muted-foreground text-xs">Console Output:</div>
                {testResult.logs.map((log, i) => (
                  <div key={i} className="text-muted-foreground text-xs">{log}</div>
                ))}
              </div>
            )}
            
            {/* Test results */}
            {testResult.results.map((result, index) => (
              <div 
                key={index}
                className={cn(
                  "border rounded-md",
                  result.passed ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"
                )}
              >
                <button
                  onClick={() => toggleTest(index)}
                  className="flex items-center gap-2 px-3 py-2 w-full text-left"
                >
                  {expandedTests.has(index) ? (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  {result.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className={cn(
                    "font-medium text-xs",
                    result.passed ? "text-green-500" : "text-destructive"
                  )}>
                    Test Case {index + 1}
                    {result.testCase.description && `: ${result.testCase.description}`}
                  </span>
                  <span className="ml-auto text-muted-foreground text-xs">
                    {result.executionResult.executionTime.toFixed(1)}ms
                  </span>
                </button>
                
                {expandedTests.has(index) && (
                  <div className="space-y-1 px-3 pt-1 pb-3 border-border/50 border-t text-xs">
                    <div>
                      <span className="text-muted-foreground">Input: </span>
                      <span className="text-foreground">{formatTestInput(result.testCase.input)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected: </span>
                      <span className="text-green-500">{formatValue(result.testCase.expected)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Actual: </span>
                      <span className={result.passed ? "text-green-500" : "text-destructive"}>
                        {result.executionResult.error 
                          ? `Error: ${result.executionResult.error}`
                          : formatValue(result.actual)
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Summary */}
            <div className={cn(
              "pt-2 font-medium text-xs",
              testResult.allPassed ? "text-green-500" : "text-destructive"
            )}>
              {testResult.allPassed 
                ? "✓ All test cases passed!" 
                : `✗ ${testResult.failedCount} test case${testResult.failedCount > 1 ? 's' : ''} failed`
              }
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground/50 italic">Click "Run Code" to execute your solution</span>
        )}
      </div>
    </div>
  );
};

export default ConsoleOutput;
