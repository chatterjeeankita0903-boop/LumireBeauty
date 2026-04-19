import { CATEGORIES, type Category } from "@/data/products";
import { cn } from "@/lib/utils";

type Filter = Category | "All";

interface Props {
  active: Filter;
  onChange: (f: Filter) => void;
}

export function CategoryTabs({ active, onChange }: Props) {
  const items: Filter[] = ["All", ...CATEGORIES];
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
      {items.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            "px-5 py-2 text-xs md:text-sm tracking-[0.2em] uppercase border transition-all",
            active === f
              ? "bg-[var(--burgundy)] text-[var(--ivory)] border-[var(--burgundy)]"
              : "bg-transparent text-foreground/70 border-[var(--champagne)] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)]"
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
