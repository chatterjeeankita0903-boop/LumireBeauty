import { Download } from "lucide-react";
import type { Review } from "@/lib/sheets";

interface Props { reviews: Review[]; }

const COLS: { key: keyof Review; label: string }[] = [
  { key: "reviewId", label: "Review ID" },
  { key: "timestamp", label: "Timestamp" },
  { key: "platform", label: "Platform" },
  { key: "productCategory", label: "Product Category" },
  { key: "productName", label: "Product Name" },
  { key: "rating", label: "Rating" },
  { key: "reviewTitle", label: "Review Title" },
  { key: "reviewText", label: "Review Text" },
  { key: "userHandle", label: "User Handle" },
];

const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function ExportCsvButton({ reviews }: Props) {
  const onClick = () => {
    const header = COLS.map((c) => csvCell(c.label)).join(",");
    const rows = reviews.map((r) => COLS.map((c) => csvCell(r[c.key])).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumiere-reviews-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-widest uppercase hover:bg-[var(--burgundy-deep)] transition"
    >
      <Download size={14} />
      Export CSV
    </button>
  );
}
