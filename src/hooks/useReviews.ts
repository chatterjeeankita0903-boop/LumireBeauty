import { useEffect, useMemo, useRef, useState } from "react";
import { fetchReviews, type Review } from "@/lib/sheets";

export function useReviews(pollMs = 30_000) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    try {
      const data = await fetchReviews();
      setReviews(data);
      setLastSync(Date.now());
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    timer.current = setInterval(load, pollMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  const avgByProduct = useMemo(() => {
    const m = new Map<string, { sum: number; count: number }>();
    for (const r of reviews) {
      if (!r.productName || !r.rating) continue;
      const cur = m.get(r.productName) ?? { sum: 0, count: 0 };
      cur.sum += r.rating;
      cur.count += 1;
      m.set(r.productName, cur);
    }
    const out = new Map<string, { avg: number; count: number }>();
    m.forEach((v, k) => out.set(k, { avg: v.sum / v.count, count: v.count }));
    return out;
  }, [reviews]);

  const countByCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of reviews) {
      if (!r.productCategory) continue;
      m.set(r.productCategory, (m.get(r.productCategory) ?? 0) + 1);
    }
    return m;
  }, [reviews]);

  return { reviews, loading, error, lastSync, refresh: load, avgByProduct, countByCategory };
}
