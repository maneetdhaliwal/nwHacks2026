import { cn } from "@/lib/utils";
import { Terminal, CheckCircle, XCircle } from "lucide-react";

interface ConsoleOutputProps {
  output: string;
  isError?: boolean;
  isSuccess?: boolean;
  className?: string;
}

const ConsoleOutput = ({ output, isError, isSuccess, className }: ConsoleOutputProps) => {
  return (
    <div className={cn("rounded-lg border border-border bg-background/50", className)}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Console</span>
        {isSuccess && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
        {isError && <XCircle className="w-4 h-4 text-destructive ml-auto" />}
      </div>
      <div className="p-3 font-mono text-sm overflow-auto max-h-32">
        {output ? (
          <pre className={cn(
            "whitespace-pre-wrap",
            isError && "text-destructive",
            isSuccess && "text-success",
            !isError && !isSuccess && "text-muted-foreground"
          )}>
            {output}
          </pre>
        ) : (
          <span className="text-muted-foreground/50 italic">No output yet</span>
        )}
      </div>
    </div>
  );
};

export default ConsoleOutput;
