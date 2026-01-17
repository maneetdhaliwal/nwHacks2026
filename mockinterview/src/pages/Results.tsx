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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Interview Complete</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Interview Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's a detailed breakdown of your performance
            </p>
          </div>
          
          {/* Overall Score Card */}
          <div className="rounded-2xl gradient-card border border-border p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-glow)' }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold mb-2">Overall Performance</h2>
                <p className="text-muted-foreground">
                  {getScoreLabel(overallScore)} performance! Keep practicing to improve further.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-4xl font-bold", getScoreColor(overallScore))}>
                      {overallScore}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-semibold">{questionsAnswered} answered</p>
                </div>
              </div>
              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trend</p>
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
                className="rounded-2xl border border-border bg-card/50 p-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Score: <span className={cn("font-medium", getScoreColor(section.score))}>{section.score}/100</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {section.feedback}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-success flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                      What you did well
                    </h4>
                    <ul className="space-y-2">
                      {section.highlights.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-warning flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4" />
                      Areas to improve
                    </h4>
                    <ul className="space-y-2">
                      {section.improvements.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate("/interview")}
              size="lg"
              className="gradient-primary text-primary-foreground glow-primary hover:opacity-90 w-full sm:w-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start New Interview
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
