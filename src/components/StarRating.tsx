import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;          // 0..5
  size?: number;
  showNumber?: boolean;
  count?: number;
  className?: string;
}

export function StarRating({ value, size = 14, showNumber = false, count, className }: Props) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.floor(rounded);
          const half = !filled && i - 0.5 === rounded;
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                "transition-colors",
                filled || half ? "text-[var(--gold)] fill-[var(--gold)]" : "text-[var(--gold)]/30 fill-[var(--gold)]/10"
              )}
            />
          );
        })}
      </div>
      {showNumber && value > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          {value.toFixed(1)}
          {count != null && ` (${count})`}
        </span>
      )}
    </div>
  );
}
