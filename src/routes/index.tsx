import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { WhyLumiere } from "@/components/WhyLumiere";
import { Testimonials } from "@/components/Testimonials";
import { products, type Category } from "@/data/products";
import { useReviews } from "@/hooks/useReviews";
import { useFadeUp } from "@/hooks/useFadeUp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumière Beauty — Elevate Your Ritual" },
      { name: "description", content: "17 luxury beauty formulations across skincare, makeup, haircare, bodycare and fragrance. Consciously crafted, dermatologist tested." },
      { property: "og:title", content: "Lumière Beauty — Elevate Your Ritual" },
      { property: "og:description", content: "Luxury beauty, consciously crafted." },
    ],
  }),
  component: HomePage,
});

type Filter = Category | "All";

function HomePage() {
  const [filter, setFilter] = useState<Filter>("All");
  const { avgByProduct } = useReviews();
  const ref = useFadeUp<HTMLDivElement>();

  const visible = useMemo(
    () => filter === "All" ? products : products.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <>
      <Hero />

      <section id="collection" className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div ref={ref} className="fade-up text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-[var(--burgundy)] uppercase mb-3">The Collection</p>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--burgundy-deep)]">Our Formulations</h2>
        </div>

        <CategoryTabs active={filter} onChange={setFilter} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} rating={avgByProduct.get(p.name)} />
          ))}
        </div>
      </section>

      <WhyLumiere />
      <Testimonials />
    </>
  );
}
