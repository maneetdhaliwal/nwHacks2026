import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import TranscriptPanel from "@/components/interview/TranscriptPanel";
import CodeEditorPanel from "@/components/interview/CodeEditorPanel";
import { Message } from "@/components/interview/ChatBubble";
import { InterviewStatus } from "@/components/interview/StatusIndicator";
import { Code2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const mockProblem = {
  title: "Two Sum",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9",
    "Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
  ],
};

const mockConversation: Omit<Message, "id" | "timestamp">[] = [
  { role: "ai", content: "Hello! Welcome to your technical interview. I'm here to assess your problem-solving skills and coding abilities. Are you ready to begin?" },
  { role: "user", content: "Yes, I'm ready! Let's do this." },
  { role: "ai", content: "Great enthusiasm! Let's start with a classic problem. I'd like you to solve the Two Sum problem. Given an array of integers and a target sum, find two numbers that add up to the target. Can you explain your approach first?" },
  { role: "user", content: "I would use a hash map to store the complement of each number as I iterate through the array. For each number, I check if it exists in the map, which gives us O(n) time complexity." },
  { role: "ai", content: "Excellent explanation! You've correctly identified the optimal approach using a hash map. The O(n) time complexity is indeed better than the brute force O(n²) solution. Now, let's see you implement it. I'll open the coding sandbox for you." },
];

const Interview = () => {
  const navigate = useNavigate();
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
    if (messageIndex >= mockConversation.length) {
      // Show code panel after conversation
      setShowCodePanel(true);
      setStatus("idle");
      return;
    }
    
    const msg = mockConversation[messageIndex];
    
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
  }, [messageIndex, addMessage]);
  
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
  
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Mode Tabs - Mobile */}
          <div className="bg-card/95 border-border fixed bottom-0 left-0 right-0 z-20 flex border-t backdrop-blur-sm md:hidden">
            <button
              onClick={() => setShowCodePanel(false)}
              className={cn(
                "flex flex-1 justify-center items-center gap-2 py-4 transition-colors",
                !showCodePanel ? "text-primary" : "text-muted-foreground"
              )}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Chat</span>
            </button>
            <button
              onClick={() => setShowCodePanel(true)}
              className={cn(
                "flex flex-1 justify-center items-center gap-2 py-4 transition-colors",
                showCodePanel ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Code2 className="h-5 w-5" />
              <span className="text-sm font-medium">Code</span>
            </button>
          </div>
          
          {/* Desktop: Two Column Layout */}
          <div className="hidden flex-1 md:flex">
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
            {showCodePanel && (
              <div className="animate-slide-in-right w-1/2">
                <CodeEditorPanel
                  problem={mockProblem}
                  onSubmit={handleCodeSubmit}
                />
              </div>
            )}
          </div>
          
          {/* Mobile: Single Panel */}
          <div className="flex-1 pb-16 md:hidden">
            {!showCodePanel ? (
              <TranscriptPanel
                messages={messages}
                status={status}
                isRecording={isRecording}
                onToggleRecording={handleToggleRecording}
                onEndInterview={handleEndInterview}
              />
            ) : (
              <CodeEditorPanel
                problem={mockProblem}
                onSubmit={handleCodeSubmit}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
