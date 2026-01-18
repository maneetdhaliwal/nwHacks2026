import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import TranscriptPanel from "@/components/interview/TranscriptPanel";
import CodeEditorPanel from "@/components/interview/CodeEditorPanel";
import ProblemSelector from "@/components/interview/ProblemSelector";
import { Message } from "@/components/interview/ChatBubble";
import { InterviewStatus } from "@/components/interview/StatusIndicator";
import { CodingProblem } from "@/data/codingProblems";
import { Code2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const Interview = () => {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const addMessage = useCallback((role: "ai" | "user", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);
  
  const simulateConversation = useCallback(() => {
    if (!selectedProblem) return;
    
    const conversation = selectedProblem.aiConversation;
    
    if (messageIndex >= conversation.length) {
      // Show code panel after conversation
      setShowCodePanel(true);
      setStatus("idle");
      return;
    }
    
    const msg = conversation[messageIndex];
    
    if (msg.role === "ai") {
      setStatus("speaking");
      setTimeout(() => {
        addMessage("ai", msg.content);
        setStatus("listening");
        setMessageIndex(prev => prev + 1);
        
        // Continue with next message
        setTimeout(() => simulateConversation(), 2000);
      }, 1500);
    } else {
      setStatus("thinking");
      setTimeout(() => {
        addMessage("user", msg.content);
        setMessageIndex(prev => prev + 1);
        
        // Continue with next message
        setTimeout(() => simulateConversation(), 1000);
      }, 1000);
    }
  }, [messageIndex, addMessage, selectedProblem]);
  
  const handleSelectProblem = (problem: CodingProblem) => {
    setSelectedProblem(problem);
  };

  const handleStartInterview = () => {
    if (selectedProblem) {
      setInterviewStarted(true);
    }
  };
  
  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setStatus("listening");
      setShowCodePanel(true); // Show code sandbox when recording starts
      // Start simulated conversation
      setTimeout(() => {
        setStatus("speaking");
        simulateConversation();
      }, 500);
    } else {
      setIsRecording(false);
      setStatus("idle");
    }
  };
  
  const handleEndInterview = () => {
    // Navigate to results with mock data
    navigate("/results", { 
      state: { 
        messages,
        duration: "12:34",
        questionsAnswered: 3,
      }
    });
  };
  
  const handleCodeSubmit = (code: string) => {
    addMessage("ai", "Great solution! Your implementation correctly uses a hash map and handles the edge cases well. Let's move on to discuss the time and space complexity of your solution.");
    setShowCodePanel(false);
  };

  // Show problem selector if interview hasn't started
  if (!interviewStarted) {
    return (
      <div className="flex flex-col bg-background min-h-screen">
        <Header />
        <main className="flex-1 pt-16">
          <div className="h-[calc(100vh-4rem)]">
            <ProblemSelector
              selectedProblem={selectedProblem}
              onSelectProblem={handleSelectProblem}
              onStartInterview={handleStartInterview}
            />
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Mode Tabs - Mobile */}
          <div className="md:hidden right-0 bottom-0 left-0 z-20 fixed flex bg-card/95 backdrop-blur-sm border-border border-t">
            <button
              onClick={() => setShowCodePanel(false)}
              className={cn(
                "flex flex-1 justify-center items-center gap-2 py-4 transition-colors",
                !showCodePanel ? "text-primary" : "text-muted-foreground"
              )}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium text-sm">Chat</span>
            </button>
            <button
              onClick={() => setShowCodePanel(true)}
              className={cn(
                "flex flex-1 justify-center items-center gap-2 py-4 transition-colors",
                showCodePanel ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Code2 className="w-5 h-5" />
              <span className="font-medium text-sm">Code</span>
            </button>
          </div>
          
          {/* Desktop: Two Column Layout */}
          <div className="hidden md:flex flex-1">
            {/* Left Panel - Transcript */}
            <div className={cn(
              "bg-card border-border border-r transition-all duration-300",
              showCodePanel ? "w-1/2" : "w-full"
            )}>
              <TranscriptPanel
                messages={messages}
                status={status}
                isRecording={isRecording}
                onToggleRecording={handleToggleRecording}
                onEndInterview={handleEndInterview}
              />
            </div>
            
            {/* Right Panel - Code Editor */}
            {showCodePanel && selectedProblem && (
              <div className="w-1/2 animate-slide-in-right">
                <CodeEditorPanel
                  problem={selectedProblem}
                  onSubmit={handleCodeSubmit}
                />
              </div>
            )}
          </div>
          
          {/* Mobile: Single Panel */}
          <div className="md:hidden flex-1 pb-16">
            {!showCodePanel ? (
              <TranscriptPanel
                messages={messages}
                status={status}
                isRecording={isRecording}
                onToggleRecording={handleToggleRecording}
                onEndInterview={handleEndInterview}
              />
            ) : selectedProblem ? (
              <CodeEditorPanel
                problem={selectedProblem}
                onSubmit={handleCodeSubmit}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
