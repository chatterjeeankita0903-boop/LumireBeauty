import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { type Product, categoryImage } from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";
import { formatINR } from "@/lib/format";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  rating?: { avg: number; count: number };
}

export function ProductCard({ product, rating }: Props) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group block bg-card border border-[var(--champagne)]/40 hover:border-[var(--burgundy)]/30 transition-all hover:shadow-xl hover:shadow-[var(--burgundy)]/5 overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--champagne)]/20">
        <img
          src={categoryImage(product.category)}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <span className="absolute top-4 left-4 px-3 py-1 bg-[var(--ivory)]/90 backdrop-blur text-[10px] tracking-[0.2em] uppercase text-[var(--burgundy)]">
          {product.category}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--ivory)]/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={cn(wished ? "fill-[var(--burgundy)] text-[var(--burgundy)]" : "text-[var(--burgundy)]")}
          />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-foreground mb-1 leading-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground italic mb-3 line-clamp-1">{product.tagline}</p>
        <div className="flex items-center justify-between">
          <StarRating value={rating?.avg ?? 0} count={rating?.count} showNumber={!!rating?.count} />
          <span className="font-display text-lg text-[var(--burgundy)]">{formatINR(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
