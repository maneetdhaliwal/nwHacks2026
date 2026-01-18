import { allChallenges, CodingProblem, BehavioralQuestion, getDifficultyColor, isCodingProblem } from "@/data/codingProblems";
import { cn } from "@/lib/utils";
import { Code2, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProblemSelectorProps {
  selectedProblem: (CodingProblem | BehavioralQuestion) | null;
  onSelectProblem: (problem: CodingProblem | BehavioralQuestion) => void;
  onStartInterview: () => void;
}

type ProblemType = "coding" | "behavioral";

const ProblemSelector = ({ 
  selectedProblem, 
  onSelectProblem, 
  onStartInterview 
}: ProblemSelectorProps) => {
  const [problemType, setProblemType] = useState<ProblemType>("coding");

  const filteredChallenges = allChallenges.filter(challenge => {
    if (problemType === "coding") {
      return isCodingProblem(challenge);
    } else {
      return !isCodingProblem(challenge);
    }
  });
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
        <p className="mx-auto max-w-md text-muted-foreground mb-6">
          Select a {problemType === "coding" ? "coding" : "behavioral"} problem to practice. The AI interviewer will guide you through solving it.
        </p>
        
        {/* Problem Type Selector */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setProblemType("coding")}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
              problemType === "coding"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <Code2 className="w-4 h-4" />
            Coding Challenges
          </button>
          <button
            onClick={() => setProblemType("behavioral")}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
              problemType === "behavioral"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card border border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            Behavioral Questions
          </button>
        </div>
      </div>

      {/* Problem Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-6xl">
          {filteredChallenges.map((problem) => {
            const isCoding = isCodingProblem(problem);
            const displayProblem = problem as any;
            return (
              <button
                key={problem.id}
                onClick={() => onSelectProblem(problem)}
                className={cn(
                  "p-4 border rounded-xl text-left transition-all duration-200 flex flex-col h-full",
                  "hover:border-primary/50 hover:bg-card/80",
                  selectedProblem?.id === problem.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-card/50"
                )}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm md:text-base flex-1">
                    {problem.title}
                  </h3>
                  {selectedProblem?.id === problem.id && (
                    <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 flex-1 mb-3">
                  {problem.description}
                </p>
                <div className="flex justify-between items-end gap-2 flex-wrap">
                  {isCoding ? (
                    <>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Code2 className="w-3 h-3" />
                        {displayProblem.category}
                      </Badge>
                      <span className={cn(
                        "font-medium text-xs",
                        getDifficultyColor(displayProblem.difficulty)
                      )}>
                        {displayProblem.difficulty}
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {displayProblem.category}
                      </Badge>
                    </>
                  )}
                </div>
              </button>
            );
          })}
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
