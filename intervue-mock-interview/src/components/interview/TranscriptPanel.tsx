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
      <div className="flex justify-between items-center px-6 py-4 border-border border-b">
        <div>
          <h2 className="font-semibold text-foreground text-lg">Interview Session</h2>
          <StatusIndicator status={status} className="mt-1" />
        </div>
      </div>
      
      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 space-y-4 p-6 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <div className="flex justify-center items-center mb-4 rounded-2xl w-16 h-16 animate-float gradient-primary glow-primary">
              <Mic className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="mb-2 font-medium text-foreground text-lg">Ready to begin</h3>
            <p className="max-w-xs text-muted-foreground text-sm">
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
      <div className="flex justify-center items-center gap-4 px-6 py-4 border-border border-t">
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
              <MicOff className="mr-2 w-5 h-5" />
              Stop
            </>
          ) : (
            <>
              <Mic className="mr-2 w-5 h-5" />
              Start
            </>
          )}
        </Button>
        
        <Button
          onClick={onEndInterview}
          variant="outline"
          size="lg"
          className="hover:bg-destructive/10 border-destructive/50 text-destructive"
        >
          <PhoneOff className="mr-2 w-5 h-5" />
          End Interview
        </Button>
      </div>
    </div>
  );
};

export default TranscriptPanel;
