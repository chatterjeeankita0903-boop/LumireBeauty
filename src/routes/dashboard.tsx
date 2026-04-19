import { useEffect, useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { useReviews } from "@/hooks/useReviews";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { ReviewsTable } from "@/components/dashboard/ReviewsTable";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ExportCsvButton } from "@/components/dashboard/ExportCsvButton";
import { N8N_WEBHOOK_URL } from "@/config/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && sessionStorage.getItem("lumiere_auth") !== "true") {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Review Dashboard — Lumière Beauty" },
      { name: "description", content: "Internal review analytics dashboard for Lumière Beauty." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { reviews, loading, lastSync, refresh } = useReviews(30_000);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [tick, setTick] = useState(0);
  const [sendingReport, setSendingReport] = useState(false);

  const sendReport = async () => {
    setSendingReport(true);
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_analysis" }),
      });
      if (!res.ok) throw new Error("bad response");
      toast.success("Report sent to owner ✨");
    } catch {
      toast.error("Couldn't send report. Please try again.");
    } finally {
      setSendingReport(false);
    }
  };

  // Tick counter for "synced X seconds ago"
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (category && r.productCategory !== category) return false;
      if (rating && Number(rating) !== r.rating) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [r.reviewId, r.productCategory, r.productName, r.reviewTitle, r.reviewText, r.userHandle, String(r.rating)].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reviews, search, category, rating]);

  const secondsAgo = lastSync ? Math.floor((Date.now() - lastSync) / 1000) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[var(--burgundy)] mb-2">Internal · Live</p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--burgundy-deep)]">Lumière Review Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {loading && !reviews.length
              ? "Loading reviews…"
              : secondsAgo == null
              ? "Awaiting first sync"
              : `Last synced ${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago · auto-refreshes every 30s`}
            <span className="hidden">{tick}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="px-4 py-2 border border-[var(--champagne)] text-xs tracking-widest uppercase hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] transition"
          >
            Refresh
          </button>
          <button
            onClick={sendReport}
            disabled={sendingReport}
            className="px-4 py-2 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-widest uppercase hover:bg-[var(--burgundy-deep)] transition disabled:opacity-50"
          >
            {sendingReport ? "Sending…" : "Email Analysis Report"}
          </button>
          <ExportCsvButton reviews={filtered} />
        </div>
      </div>

      {loading && !reviews.length ? (
        <SkeletonGrid />
      ) : (
        <div className="space-y-8">
          <MetricCards reviews={reviews} />
          <FiltersBar
            search={search} category={category} rating={rating}
            onSearch={setSearch} onCategory={setCategory} onRating={setRating}
          />
          <ReviewsTable reviews={filtered} />
          <ChartsSection reviews={filtered} />
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-[var(--champagne)]/30 animate-pulse" />
        ))}
      </div>
      <div className="h-12 bg-[var(--champagne)]/30 animate-pulse" />
      <div className="h-96 bg-[var(--champagne)]/30 animate-pulse" />
    </div>
  );
}
