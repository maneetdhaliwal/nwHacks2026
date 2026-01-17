import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Send, Code2 } from "lucide-react";
import ConsoleOutput from "./ConsoleOutput";

interface CodeEditorPanelProps {
  problem: {
    title: string;
    description: string;
    examples: string[];
  };
  onSubmit: (code: string) => void;
}

const CodeEditorPanel = ({ problem, onSubmit }: CodeEditorPanelProps) => {
  const [code, setCode] = useState(`function solution(nums) {\n  // Write your code here\n  \n}`);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setIsSuccess(false);
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock output
    const mockOutputs = [
      { text: "Test case 1: [2, 7, 11, 15], target = 9\nOutput: [0, 1] ✓\n\nTest case 2: [3, 2, 4], target = 6\nOutput: [1, 2] ✓\n\nAll test cases passed!", success: true },
      { text: "TypeError: Cannot read property 'length' of undefined\n    at solution (line 3)", success: false },
      { text: "Test case 1: [2, 7, 11, 15], target = 9\nExpected: [0, 1]\nReceived: [1, 0]\n\n1 test case failed", success: false },
    ];
    
    const randomOutput = mockOutputs[Math.floor(Math.random() * mockOutputs.length)];
    setOutput(randomOutput.text);
    setIsError(!randomOutput.success);
    setIsSuccess(randomOutput.success);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Problem Description */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{problem.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {problem.description}
        </p>
        <div className="space-y-2">
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-muted/50 rounded-lg px-3 py-2">
              <pre className="text-xs font-mono text-secondary-foreground">{example}</pre>
            </div>
          ))}
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex-1 rounded-lg border border-border bg-background/50 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">solution.js</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 bg-transparent font-mono text-sm text-foreground resize-none focus:outline-none min-h-[200px]"
            spellCheck={false}
          />
        </div>
        
        {/* Console */}
        <ConsoleOutput 
          output={output} 
          isError={isError} 
          isSuccess={isSuccess}
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
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
