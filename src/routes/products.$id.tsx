import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Heart, ChevronLeft } from "lucide-react";
import { getProduct, productImage, type Product } from "@/data/products";
import { useReviews } from "@/hooks/useReviews";
import { useWishlist } from "@/hooks/useWishlist";
import { useChatbot } from "@/components/ChatbotContext";
import { StarRating } from "@/components/StarRating";
import { formatINR } from "@/lib/format";


export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — Lumière Beauty` },
      { name: "description", content: `${loaderData.product.tagline}. ${loaderData.product.claims.join(", ")}.` },
      { property: "og:title", content: `${loaderData.product.name} — Lumière Beauty` },
      { property: "og:description", content: loaderData.product.tagline },
    ] : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-[var(--burgundy)]">Product not found</h1>
      <Link to="/" className="inline-block mt-6 text-sm tracking-widest uppercase text-[var(--burgundy)] underline">Back to collection</Link>
    </div>
  ),
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-destructive">Something went wrong: {error.message}</p>
        <button onClick={() => router.invalidate()} className="mt-4 px-4 py-2 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-widest uppercase">Retry</button>
      </div>
    );
  },
});

function ProductPage() {
  const data = Route.useLoaderData() as { product: Product };
  const { product } = data;
  const { reviews, avgByProduct, loading } = useReviews();
  const { has, toggle } = useWishlist();
  const { openWithReview } = useChatbot();
  const rating = avgByProduct.get(product.name);
  const wished = has(product.id);

  const productReviews = reviews
    .filter((r) => r.productName === product.name)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-widest uppercase text-muted-foreground hover:text-[var(--burgundy)] mb-8">
        <ChevronLeft size={14} /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square relative overflow-hidden bg-[var(--champagne)]/20">
          <img
            src={productImage(product.id, product.category)}
            alt={product.name}
            width={1024}
            height={1280}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute top-5 left-5 px-3 py-1 bg-[var(--ivory)]/90 text-[10px] tracking-[0.2em] uppercase text-[var(--burgundy)]">
            {product.category}
          </span>
        </div>

        <div>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--burgundy-deep)] leading-tight mb-3">{product.name}</h1>
          <p className="italic text-lg text-muted-foreground mb-5">{product.tagline}</p>

          <div className="flex items-center gap-4 mb-6">
            <StarRating value={rating?.avg ?? 0} count={rating?.count} showNumber size={16} />
          </div>

          <div className="font-display text-3xl text-[var(--burgundy)] mb-8">{formatINR(product.price)}</div>

          <div className="flex flex-wrap gap-2 mb-8">
            {product.claims.map((c) => (
              <span key={c} className="px-3 py-1.5 text-xs tracking-wider bg-[var(--champagne)]/40 border border-[var(--champagne)] text-[var(--burgundy-deep)] rounded-full">
                {c}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openWithReview(product)}
              className="flex-1 px-6 py-4 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-[0.25em] uppercase hover:bg-[var(--burgundy-deep)] transition"
            >
              Write a Review
            </button>
            <button
              onClick={() => toggle(product.id)}
              className="w-14 h-14 border border-[var(--champagne)] flex items-center justify-center hover:border-[var(--burgundy)] transition"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wished ? "fill-[var(--burgundy)] text-[var(--burgundy)]" : "text-[var(--burgundy)]"} />
            </button>
          </div>

          {/* Reviews section */}
          <section className="mt-12 pt-8 border-t border-[var(--champagne)]/60">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display text-2xl text-[var(--burgundy-deep)]">Customer Reviews</h2>
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                {productReviews.length} {productReviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>

            {loading && productReviews.length === 0 ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className="h-24 bg-[var(--champagne)]/20 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : productReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No reviews yet. Be the first to share your experience.
              </p>
            ) : (
              <ul className="space-y-5">
                {productReviews.map((r) => (
                  <li key={r.reviewId} className="border border-[var(--champagne)]/50 bg-card p-4 rounded-lg">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-medium text-foreground leading-tight">{r.reviewTitle}</h3>
                        <p className="text-[11px] tracking-widest uppercase text-muted-foreground mt-0.5">
                          {r.userHandle || "Anonymous"}
                          {r.timestamp && ` · ${new Date(r.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                        </p>
                      </div>
                      <StarRating value={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{r.reviewText}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
