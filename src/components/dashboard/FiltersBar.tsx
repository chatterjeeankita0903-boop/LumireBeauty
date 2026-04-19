import { CATEGORIES } from "@/data/products";
import { Search } from "lucide-react";

interface Props {
  search: string;
  category: string;
  rating: string;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onRating: (v: string) => void;
}

export function FiltersBar({ search, category, rating, onSearch, onCategory, onRating }: Props) {
  const sel = "px-3 py-2 bg-card border border-[var(--champagne)] text-sm outline-none focus:border-[var(--burgundy)]";
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search reviews…"
          className="w-full pl-9 pr-3 py-2 bg-card border border-[var(--champagne)] text-sm outline-none focus:border-[var(--burgundy)]"
        />
      </div>
      <select value={category} onChange={(e) => onCategory(e.target.value)} className={sel}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={rating} onChange={(e) => onRating(e.target.value)} className={sel}>
        <option value="">All ratings</option>
        {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
      </select>
    </div>
  );
}
