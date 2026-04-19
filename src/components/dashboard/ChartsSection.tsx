import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { Review } from "@/lib/sheets";

const PALETTE = ["#6B1E3C", "#C9A961", "#E8D5B7", "#F4C6C6", "#501730"];

interface Props { reviews: Review[]; }

export function ChartsSection({ reviews }: Props) {
  // Avg per product
  const productMap = new Map<string, { sum: number; count: number }>();
  for (const r of reviews) {
    if (!r.productName || !r.rating) continue;
    const cur = productMap.get(r.productName) ?? { sum: 0, count: 0 };
    cur.sum += r.rating; cur.count += 1;
    productMap.set(r.productName, cur);
  }
  const barData = Array.from(productMap.entries())
    .map(([name, v]) => ({
      name: name.length > 14 ? name.slice(0, 13) + "…" : name,
      avg: Number((v.sum / v.count).toFixed(2)),
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  // Count per category
  const catMap = new Map<string, number>();
  for (const r of reviews) if (r.productCategory) catMap.set(r.productCategory, (catMap.get(r.productCategory) ?? 0) + 1);
  const pieData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-[var(--champagne)]/60 p-5">
        <h3 className="font-display text-lg text-[var(--burgundy-deep)] mb-4">Average Rating · Per Product</h3>
        <div className="h-72">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 50 }}>
                <CartesianGrid stroke="#E8D5B7" strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: "rgba(107,30,60,0.05)" }} />
                <Bar dataKey="avg" fill="#6B1E3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      <div className="bg-card border border-[var(--champagne)]/60 p-5">
        <h3 className="font-display text-lg text-[var(--burgundy-deep)] mb-4">Reviews · By Category</h3>
        <div className="h-72">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
      No data yet — submit a review to see this chart.
    </div>
  );
}
