import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Send, Code2 } from "lucide-react";
import ConsoleOutput from "./ConsoleOutput";
import { runTests, TestCase, TestRunResult } from "@/lib/testRunner";

interface CodeEditorPanelProps {
  problem: {
    title: string;
    description: string;
    examples: string[];
    testCases: TestCase[];
    starterCode?: string;
  };
  onSubmit: (code: string) => void;
}

const CodeEditorPanel = ({ problem, onSubmit }: CodeEditorPanelProps) => {
  const [code, setCode] = useState(problem.starterCode || `function solution(nums, target) {\n  // Write your code here\n  \n}`);
  const [testResult, setTestResult] = useState<TestRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResult(null);
    
    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = runTests(code, problem.testCases);
    setTestResult(result);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Problem Description */}
      <div className="px-6 py-4 border-border border-b">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground text-lg">{problem.title}</h2>
        </div>
        <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
          {problem.description}
        </p>
        <div className="space-y-2">
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-muted/50 px-3 py-2 rounded-lg">
              <pre className="font-mono text-secondary-foreground text-xs">{example}</pre>
            </div>
          ))}
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex flex-col flex-1 p-4 min-h-0">
        <div className="flex-1 bg-background/50 border border-border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 border-border border-b">
            <div className="flex gap-1.5">
              <div className="bg-destructive/60 rounded-full w-3 h-3" />
              <div className="bg-warning/60 rounded-full w-3 h-3" />
              <div className="bg-success/60 rounded-full w-3 h-3" />
            </div>
            <span className="ml-2 text-muted-foreground text-xs">solution.js</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-transparent p-4 focus:outline-none w-full h-full min-h-[200px] font-mono text-foreground text-sm resize-none"
            spellCheck={false}
          />
        </div>
        
        {/* Console */}
        <ConsoleOutput 
          testResult={testResult}
          className="mt-4" 
        />
        
        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={handleRunCode}
            variant="outline"
            className="flex-1"
            disabled={isRunning}
          >
            <Play className="mr-2 w-4 h-4" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 hover:opacity-90 text-primary-foreground gradient-primary"
          >
            <Send className="mr-2 w-4 h-4" />
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
