import { SHEET_READ_URL } from "@/config/api";

export interface Review {
  reviewId: string;
  timestamp: string;
  platform: string;
  productCategory: string;
  productName: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  userHandle: string;
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(SHEET_READ_URL, { cache: "no-store" });
  const text = await res.text();
  const raw = text.replace(/^[^{]+/, "").replace(/[^}]+$/, "");
  const json = JSON.parse(raw);
  const rows: any[] = json.table.rows ?? [];

  return rows
    .map((r) => {
      const c = r.c ?? [];
      const v = (i: number) => (c[i] && c[i].v != null ? c[i].v : "");
      const ratingRaw = v(5);
      const rating = typeof ratingRaw === "number" ? ratingRaw : Number(ratingRaw) || 0;
      let timestamp = v(1);
      if (timestamp && typeof timestamp === "string" && timestamp.startsWith("Date(")) {
        // GViz date string: Date(2025,3,19,10,30,0)
        const m = timestamp.match(/Date\((\d+),(\d+),(\d+),?(\d+)?,?(\d+)?,?(\d+)?\)/);
        if (m) {
          const d = new Date(+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
          timestamp = d.toISOString();
        }
      }
      return {
        reviewId: String(v(0)),
        timestamp: String(timestamp),
        platform: String(v(2)),
        productCategory: String(v(3)),
        productName: String(v(4)),
        rating,
        reviewTitle: String(v(6)),
        reviewText: String(v(7)),
        userHandle: String(v(8)),
      } as Review;
    })
    .filter((r) => r.reviewId);
}
