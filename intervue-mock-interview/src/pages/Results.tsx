import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  MessageSquare, 
  Code2, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  RotateCcw,
  Download,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackSection {
  title: string;
  icon: React.ElementType;
  score: number;
  feedback: string;
  highlights: string[];
  improvements: string[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { duration = "12:34", questionsAnswered = 3 } = location.state || {};
  
  const overallScore = 82;
  
  const feedbackSections: FeedbackSection[] = [
    {
      title: "Communication",
      icon: MessageSquare,
      score: 85,
      feedback: "You demonstrated clear and structured communication throughout the interview. Your explanations were well-organized and easy to follow.",
      highlights: [
        "Clear problem breakdown",
        "Good use of technical terminology",
        "Asked clarifying questions",
      ],
      improvements: [
        "Consider pausing before answering complex questions",
        "Elaborate more on trade-offs between solutions",
      ],
    },
    {
      title: "Technical Skills",
      icon: Code2,
      score: 78,
      feedback: "Solid understanding of data structures and algorithms. Your hash map solution was optimal and well-implemented.",
      highlights: [
        "Correct time/space complexity analysis",
        "Clean code structure",
        "Handled edge cases well",
      ],
      improvements: [
        "Consider discussing alternative approaches first",
        "Add more inline comments for complex logic",
      ],
    },
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };
  
  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="px-6 pt-24 pb-12">
        <div className="mx-auto max-w-4xl container">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-muted-foreground text-sm">Interview Complete</span>
            </div>
            
            <h1 className="mb-4 font-bold text-4xl md:text-5xl">
              Your Interview Results
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's a detailed breakdown of your performance
            </p>
          </div>
          
          {/* Overall Score Card */}
          <div className="relative mb-8 p-8 border border-border rounded-2xl overflow-hidden gradient-card">
            <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-glow)' }} />
            <div className="z-10 relative flex md:flex-row flex-col justify-between items-center gap-8">
              <div className="md:text-left text-center">
                <h2 className="mb-2 font-semibold text-xl">Overall Performance</h2>
                <p className="text-muted-foreground">
                  {getScoreLabel(overallScore)} performance! Keep practicing to improve further.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${overallScore * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <span className={cn("font-bold text-4xl", getScoreColor(overallScore))}>
                      {overallScore}
                    </span>
                    <span className="text-muted-foreground text-sm">/100</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="z-10 relative gap-4 grid grid-cols-2 md:grid-cols-3 mt-8 pt-8 border-border/50 border-t">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Duration</p>
                  <p className="font-semibold">{duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Questions</p>
                  <p className="font-semibold">{questionsAnswered} answered</p>
                </div>
              </div>
              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="flex justify-center items-center bg-primary/10 rounded-lg w-10 h-10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Trend</p>
                  <p className="font-semibold text-success">+12% improvement</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feedback Sections */}
          <div className="space-y-6 mb-8">
            {feedbackSections.map((section, index) => (
              <div 
                key={index}
                className="bg-card/50 p-6 border border-border rounded-2xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center rounded-lg w-10 h-10 gradient-primary">
                      <section.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        Score: <span className={cn("font-medium", getScoreColor(section.score))}>{section.score}/100</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {section.feedback}
                </p>
                
                <div className="gap-6 grid md:grid-cols-2">
                  <div>
                    <h4 className="flex items-center gap-2 mb-3 font-medium text-success text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      What you did well
                    </h4>
                    <ul className="space-y-2">
                      {section.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                          <span className="flex-shrink-0 bg-success mt-1.5 rounded-full w-1.5 h-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center gap-2 mb-3 font-medium text-warning text-sm">
                      <TrendingUp className="w-4 h-4" />
                      Areas to improve
                    </h4>
                    <ul className="space-y-2">
                      {section.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                          <span className="flex-shrink-0 bg-warning mt-1.5 rounded-full w-1.5 h-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
            <Button
              onClick={() => navigate("/interview")}
              size="lg"
              className="hover:opacity-90 w-full sm:w-auto text-primary-foreground gradient-primary glow-primary"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Start New Interview
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 w-5 h-5" />
              Download Report
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Share2 className="mr-2 w-5 h-5" />
              Share Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
