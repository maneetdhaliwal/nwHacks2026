import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isAI = message.role === "ai";
  
  return (
    <div className={cn(
      "flex gap-3 animate-fade-in",
      isAI ? "flex-row" : "flex-row-reverse"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden",
        isAI ? "gradient-primary" : "bg-secondary"
      )}>
        {isAI ? (
          <img src="/mockr_logo_noborder.png" alt="Mockr" className="w-full h-full object-cover" />
        ) : (
          <User className="w-4 h-4 text-secondary-foreground" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isAI 
          ? "bg-card border border-border rounded-tl-sm" 
          : "bg-primary/10 border border-primary/20 rounded-tr-sm"
      )}>
        <p className="text-sm text-foreground leading-relaxed">
          {message.content}
        </p>
        <span className="text-xs text-muted-foreground mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
