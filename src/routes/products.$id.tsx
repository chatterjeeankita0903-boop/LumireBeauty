import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Heart, ChevronLeft } from "lucide-react";
import { getProduct, categoryImage, type Product } from "@/data/products";
import { useReviews } from "@/hooks/useReviews";
import { useWishlist } from "@/hooks/useWishlist";
import { useChatbot } from "@/components/ChatbotContext";
import { StarRating } from "@/components/StarRating";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

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
  const { avgByProduct } = useReviews();
  const { has, toggle } = useWishlist();
  const { openWithReview } = useChatbot();
  const rating = avgByProduct.get(product.name);
  const wished = has(product.id);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-widest uppercase text-muted-foreground hover:text-[var(--burgundy)] mb-8">
        <ChevronLeft size={14} /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square relative overflow-hidden bg-[var(--champagne)]/20">
          <img
            src={categoryImage(product.category)}
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
        </div>
      </div>
    </div>
  );
}
