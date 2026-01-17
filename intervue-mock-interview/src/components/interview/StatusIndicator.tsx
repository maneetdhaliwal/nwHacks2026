import { cn } from "@/lib/utils";

export type InterviewStatus = "idle" | "listening" | "speaking" | "thinking";

interface StatusIndicatorProps {
  status: InterviewStatus;
  className?: string;
}

const statusConfig: Record<InterviewStatus, { label: string; color: string; bgColor: string }> = {
  idle: { 
    label: "Ready", 
    color: "text-muted-foreground",
    bgColor: "bg-muted-foreground/20"
  },
  listening: { 
    label: "Listening", 
    color: "text-info",
    bgColor: "bg-info/20"
  },
  speaking: { 
    label: "Speaking", 
    color: "text-success",
    bgColor: "bg-success/20"
  },
  thinking: { 
    label: "Thinking", 
    color: "text-warning",
    bgColor: "bg-warning/20"
  },
};

const StatusIndicator = ({ status, className }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full",
          config.bgColor
        )}>
          <div className={cn(
            "absolute inset-0 w-2.5 h-2.5 rounded-full",
            status !== "idle" && "animate-pulse-ring",
            config.bgColor
          )} />
          <div className={cn(
            "absolute inset-0 w-2.5 h-2.5 rounded-full",
            config.color.replace("text-", "bg-")
          )} />
        </div>
      </div>
      <span className={cn("text-sm font-medium", config.color)}>
        {config.label}
      </span>
    </div>
  );
};

export default StatusIndicator;
