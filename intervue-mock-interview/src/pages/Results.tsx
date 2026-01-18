import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  MessageSquare, 
  Code2, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  Download,
  Share2,
  Loader2
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

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { messages = [], duration = "12:34", questionsAnswered = 3, submittedCode } = location.state || {};
  
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [feedbackSections, setFeedbackSections] = useState<FeedbackSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const analyzeInterview = async (conversationMessages: Message[], code?: string) => {
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenRouter API key not found');
      }

      const conversationText = conversationMessages
        .map(msg => `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
        .join('\n\n');

      const systemPrompt = `You are an expert coding interview evaluator. Analyze the following interview conversation and provide detailed feedback in JSON format.

Return a JSON object with this exact structure:
{
  "overallScore": <number between 0-100>,
  "communication": {
    "score": <number 0-100>,
    "feedback": "<detailed paragraph about communication skills>",
    "highlights": ["<positive point 1>", "<positive point 2>", "<positive point 3>"],
    "improvements": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
  },
  "technicalSkills": {
    "score": <number 0-100>,
    "feedback": "<detailed paragraph about technical skills>",
    "highlights": ["<positive point 1>", "<positive point 2>", "<positive point 3>"],
    "improvements": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
  }
}

Guidelines for scoring:
- Overall score: Average of communication and technical scores
- Communication: How clearly they explained concepts, asked questions, structured responses. Penalize heavily for minimal or no participation.
- Technical: Understanding of algorithms, problem-solving approach, code quality. Give very low scores for no code submission or minimal effort.

IMPORTANT SCORING RULES:
- If the candidate submitted no code or just empty/whitespace code: technical score should be 0-20
- If the candidate had no conversation or only 1-2 minimal responses: communication score should be 0-30, overall score 0-25
- If the candidate showed no understanding of the problem: technical score should be 0-40
- Be extremely critical of candidates who did minimal work - they should receive scores in the 0-30 range
- Only give high scores (70+) for candidates who actively engaged, wrote substantial code, and demonstrated problem-solving skills

Be constructive but realistic. Focus on JavaScript programming concepts. Base scores on actual evidence from the conversation and code.`;

      const userPrompt = `Please analyze this coding interview conversation:

${conversationText}

${code ? `Submitted Code:\n${code}` : 'NO CODE SUBMITTED'}

ANALYSIS REQUIREMENTS:
- Count the number of candidate responses: ${conversationMessages.filter(msg => msg.role === 'user').length}
- Code submitted: ${code && code.trim().length > 10 ? 'Yes' : 'No'}
- If no code or minimal conversation, give very low scores (0-30 range)
- If substantial code and active conversation, consider higher scores
- Be specific about what the candidate actually did vs generic praise

Provide detailed feedback on the candidate's actual performance.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response from AI service');
      }

      const analysisText = data.choices[0].message.content;
      
      // Parse the JSON response
      const analysis = JSON.parse(analysisText);
      
      setOverallScore(analysis.overallScore);
      
      const sections: FeedbackSection[] = [
        {
          title: "Communication",
          icon: MessageSquare,
          score: analysis.communication.score,
          feedback: analysis.communication.feedback,
          highlights: analysis.communication.highlights,
          improvements: analysis.communication.improvements,
        },
        {
          title: "Technical Skills",
          icon: Code2,
          score: analysis.technicalSkills.score,
          feedback: analysis.technicalSkills.feedback,
          highlights: analysis.technicalSkills.highlights,
          improvements: analysis.technicalSkills.improvements,
        },
      ];
      
      setFeedbackSections(sections);
      setIsLoading(false);
    } catch (err) {
      console.error('Error analyzing interview:', err);
      setError('Failed to generate feedback. Please try again.');
      setIsLoading(false);
      
      // Fallback to basic feedback - assume minimal effort
      const userMessages = conversationMessages.filter(msg => msg.role === 'user');
      const hasCode = code && code.trim().length > 10; // More than just whitespace/comments
      
      let fallbackScore = 15; // Very low default
      if (userMessages.length > 2) fallbackScore += 10;
      if (hasCode) fallbackScore += 15;
      
      setOverallScore(fallbackScore);
      setFeedbackSections([
        {
          title: "Communication",
          icon: MessageSquare,
          score: Math.min(userMessages.length * 8, 30), // Max 30 for minimal participation
          feedback: userMessages.length === 0 
            ? "No communication was observed during the interview. The candidate did not engage with the interviewer or provide any responses."
            : `Limited communication was observed with only ${userMessages.length} response${userMessages.length === 1 ? '' : 's'}. The candidate showed minimal engagement with the interview process.`,
          highlights: userMessages.length > 0 ? ["Attempted to participate"] : [],
          improvements: ["Engage more actively with the interviewer", "Ask clarifying questions", "Explain your thought process"],
        },
        {
          title: "Technical Skills",
          icon: Code2,
          score: hasCode ? 25 : 5,
          feedback: !hasCode
            ? "No code was submitted or the submitted code was empty. The candidate did not attempt to solve the coding problem."
            : "Minimal code was submitted but showed basic understanding. However, the solution was incomplete and did not demonstrate problem-solving skills.",
          highlights: hasCode ? ["Submitted some code"] : [],
          improvements: ["Write complete, working solutions", "Test your code thoroughly", "Consider edge cases and error handling"],
        },
      ]);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      analyzeInterview(messages, submittedCode);
    } else {
      setIsLoading(false);
      setError('No interview data available');
    }
  }, [messages, submittedCode]);
  
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
              {isLoading ? 'Analyzing your performance...' : 'Here\'s a detailed breakdown of your performance'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="mb-4 w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Generating personalized feedback...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-4 text-destructive">{error}</p>
              <Button onClick={() => navigate("/")}>
                Return to Problem Selection
              </Button>
            </div>
          ) : overallScore !== null ? (
            <>
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
            </>
          ) : null}
          
          {/* Actions */}
          <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
            <Button
              onClick={() => navigate("/")}
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
