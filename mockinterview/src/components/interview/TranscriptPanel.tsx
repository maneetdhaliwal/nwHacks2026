import { useEffect, useRef } from "react";
import ChatBubble, { Message } from "./ChatBubble";
import StatusIndicator, { InterviewStatus } from "./StatusIndicator";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff } from "lucide-react";

interface TranscriptPanelProps {
  messages: Message[];
  status: InterviewStatus;
  isRecording: boolean;
  onToggleRecording: () => void;
  onEndInterview: () => void;
}

const TranscriptPanel = ({
  messages,
  status,
  isRecording,
  onToggleRecording,
  onEndInterview,
}: TranscriptPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Interview Session</h2>
          <StatusIndicator status={status} className="mt-1" />
        </div>
      </div>
      
      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 glow-primary animate-float">
              <Mic className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to begin</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Click Start to begin your mock technical interview with our AI interviewer.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        )}
      </div>
      
      {/* Controls */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-center gap-4">
        <Button
          onClick={onToggleRecording}
          size="lg"
          className={
            isRecording 
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
              : "gradient-primary text-primary-foreground hover:opacity-90 glow-primary"
          }
        >
          {isRecording ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </Button>
        
        {isRecording && (
          <Button
            onClick={onEndInterview}
            variant="outline"
            size="lg"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
