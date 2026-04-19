import { useFadeUp } from "@/hooks/useFadeUp";

export function Hero() {
  const ref = useFadeUp<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden bg-[var(--ivory)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[var(--blush)]/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[var(--champagne)]/40 blur-3xl" />
      </div>
      <div ref={ref} className="fade-up relative max-w-5xl mx-auto px-6 lg:px-10 pt-24 pb-28 md:pt-36 md:pb-40 text-center">
        <p className="text-xs tracking-[0.4em] text-[var(--burgundy)]/70 mb-6 uppercase">Maison de Beauté · Est. 2024</p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--burgundy-deep)] leading-[1.05] mb-6">
          Elevate Your Ritual
        </h1>
        <p className="text-base md:text-lg text-foreground/70 max-w-xl mx-auto mb-10 leading-relaxed">
          Luxury beauty, consciously crafted. Seventeen formulations,
          one quiet philosophy — let your routine become your sanctuary.
        </p>
        <a
          href="#collection"
          className="inline-flex items-center justify-center px-9 py-4 bg-[var(--burgundy)] text-[var(--ivory)] text-sm tracking-[0.25em] uppercase hover:bg-[var(--burgundy-deep)] transition-colors shadow-lg shadow-[var(--burgundy)]/20"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}
