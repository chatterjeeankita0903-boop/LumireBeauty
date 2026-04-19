import type { Review } from "@/lib/sheets";
import { Star, MessageSquare, Award, Layers } from "lucide-react";

interface Props { reviews: Review[]; }

export function MetricCards({ reviews }: Props) {
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / total : 0;

  // Top rated product
  const byProduct = new Map<string, { sum: number; count: number }>();
  for (const r of reviews) {
    if (!r.productName || !r.rating) continue;
    const cur = byProduct.get(r.productName) ?? { sum: 0, count: 0 };
    cur.sum += r.rating; cur.count += 1;
    byProduct.set(r.productName, cur);
  }
  let topProduct = "—"; let topAvg = 0;
  byProduct.forEach((v, k) => {
    const a = v.sum / v.count;
    if (a > topAvg) { topAvg = a; topProduct = k; }
  });

  // Most reviewed category
  const byCat = new Map<string, number>();
  for (const r of reviews) if (r.productCategory) byCat.set(r.productCategory, (byCat.get(r.productCategory) ?? 0) + 1);
  let topCat = "—"; let topCount = 0;
  byCat.forEach((v, k) => { if (v > topCount) { topCount = v; topCat = k; }});

  const cards = [
    { label: "Total Reviews", value: String(total), icon: MessageSquare },
    { label: "Average Rating", value: total ? `★ ${avg.toFixed(1)}` : "—", icon: Star },
    { label: "Top Rated Product", value: topProduct, icon: Award, sub: topAvg ? `★ ${topAvg.toFixed(1)}` : "" },
    { label: "Most Reviewed Category", value: topCat, icon: Layers, sub: topCount ? `${topCount} reviews` : "" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-card border border-[var(--champagne)]/60 p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c.label}</span>
            <c.icon size={16} className="text-[var(--burgundy)]/60" />
          </div>
          <div className="font-display text-2xl text-[var(--burgundy-deep)] leading-tight truncate">{c.value}</div>
          {c.sub && <div className="text-xs text-muted-foreground">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
