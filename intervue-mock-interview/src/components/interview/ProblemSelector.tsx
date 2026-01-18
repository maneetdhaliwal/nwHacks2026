import { codingProblems, CodingProblem, getDifficultyColor } from "@/data/codingProblems";
import { cn } from "@/lib/utils";
import { Code2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProblemSelectorProps {
  selectedProblem: CodingProblem | null;
  onSelectProblem: (problem: CodingProblem) => void;
  onStartInterview: () => void;
}

const ProblemSelector = ({ 
  selectedProblem, 
  onSelectProblem, 
  onStartInterview 
}: ProblemSelectorProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-8 border-border border-b text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-sm">Select a Problem</span>
        </div>
        <h1 className="mb-2 font-bold text-foreground text-2xl md:text-3xl">
          Choose Your Challenge
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Select a coding problem to practice. The AI interviewer will guide you through solving it.
        </p>
      </div>

      {/* Problem Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="gap-4 grid mx-auto max-w-3xl">
          {codingProblems.map((problem) => (
            <button
              key={problem.id}
              onClick={() => onSelectProblem(problem)}
              className={cn(
                "p-4 border rounded-xl w-full text-left transition-all duration-200",
                "hover:border-primary/50 hover:bg-card/80",
                selectedProblem?.id === problem.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card/50"
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {problem.title}
                    </h3>
                    {selectedProblem?.id === problem.id && (
                      <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {problem.description}
                  </p>
                </div>
                <div className="flex flex-col flex-shrink-0 items-end gap-2">
                  <span className={cn(
                    "font-medium text-xs",
                    getDifficultyColor(problem.difficulty)
                  )}>
                    {problem.difficulty}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {problem.category}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="bg-card/50 p-6 border-border border-t">
        <div className="mx-auto max-w-3xl">
          <Button
            onClick={onStartInterview}
            disabled={!selectedProblem}
            size="lg"
            className={cn(
              "w-full text-primary-foreground gradient-primary glow-primary",
              "hover:opacity-90 transition-opacity py-6 text-base",
              !selectedProblem && "opacity-50 cursor-not-allowed"
            )}
          >
            {selectedProblem ? (
              <>
                Start Interview: {selectedProblem.title}
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            ) : (
              "Select a Problem to Start"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProblemSelector;
