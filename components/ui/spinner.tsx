import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={cn("h-6 w-6 animate-spin text-muted-foreground", className)}
      />
    </div>
  );
}
