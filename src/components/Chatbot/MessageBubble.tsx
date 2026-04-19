import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  role: "user" | "assistant";
  children: ReactNode;
}

export function MessageBubble({ role, children }: Props) {
  return (
    <div className={cn("flex slide-up", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",
          role === "user"
            ? "bg-[var(--burgundy)] text-[var(--ivory)] rounded-2xl rounded-br-sm"
            : "bg-card border border-[var(--champagne)]/60 text-foreground rounded-2xl rounded-bl-sm"
        )}
      >
        {children}
      </div>
    </div>
  );
}
