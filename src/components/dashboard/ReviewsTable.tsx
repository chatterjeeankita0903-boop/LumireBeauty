import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Review } from "@/lib/sheets";
import { StarRating } from "../StarRating";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";

type Key = keyof Review;

interface Props { reviews: Review[]; }

const cols: { key: Key; label: string }[] = [
  { key: "reviewId", label: "Review ID" },
  { key: "timestamp", label: "Date" },
  { key: "productCategory", label: "Category" },
  { key: "productName", label: "Product" },
  { key: "rating", label: "Rating" },
  { key: "reviewTitle", label: "Title" },
  { key: "reviewText", label: "Review" },
  { key: "userHandle", label: "Handle" },
];

export function ReviewsTable({ reviews }: Props) {
  const [sort, setSort] = useState<{ key: Key; dir: "asc" | "desc" }>({ key: "timestamp", dir: "desc" });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const sorted = [...reviews].sort((a, b) => {
    const av = a[sort.key]; const bv = b[sort.key];
    if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
    const as = String(av); const bs = String(bv);
    return sort.dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
  });

  const toggleSort = (k: Key) => {
    setSort((s) => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" });
  };

  return (
    <div className="bg-card border border-[var(--champagne)]/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--champagne)]/30">
            <tr>
              {cols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className="text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--burgundy)] cursor-pointer select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sort.key === c.key && (sort.dir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const isOpen = expanded[r.reviewId];
              const truncated = r.reviewText.length > 80 && !isOpen ? r.reviewText.slice(0, 80) + "…" : r.reviewText;
              return (
                <tr key={r.reviewId} className={cn("border-t border-[var(--champagne)]/30", i % 2 === 1 && "bg-[var(--ivory)]/60")}>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.reviewId}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{formatTimestamp(r.timestamp)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.productCategory}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.productName}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><StarRating value={r.rating} /></td>
                  <td className="px-4 py-3 max-w-[200px]">{r.reviewTitle}</td>
                  <td className="px-4 py-3 max-w-[320px]">
                    {truncated}
                    {r.reviewText.length > 80 && (
                      <button
                        onClick={() => setExpanded((e) => ({ ...e, [r.reviewId]: !isOpen }))}
                        className="ml-1 text-[var(--burgundy)] text-xs underline"
                      >
                        {isOpen ? "Less" : "Read more"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--burgundy)] whitespace-nowrap">{r.userHandle}</td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={cols.length} className="text-center text-muted-foreground py-12">
                  No reviews to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
