import { useEffect, useState } from "react";
import { useFadeUp } from "@/hooks/useFadeUp";

const quotes = [
  {
    text: "Lumière transformed my morning ritual. The serums feel like a quiet luxury — my skin has never looked better.",
    author: "Anaïs R.",
    role: "Editor, Vogue India",
  },
  {
    text: "It's rare to find products that feel both clinical and poetic. Bloom EDP is the only fragrance I wear now.",
    author: "Priya M.",
    role: "Creative Director",
  },
  {
    text: "Every detail is considered, from packaging to scent. This is the future of conscious luxury beauty.",
    author: "Devika S.",
    role: "Beauty Curator",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const ref = useFadeUp<HTMLDivElement>();

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24 bg-[var(--ivory)]">
      <div ref={ref} className="fade-up max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs tracking-[0.4em] text-[var(--burgundy)] uppercase mb-8">Praise</p>
        <div className="min-h-[180px]">
          <blockquote key={i} className="slide-up">
            <p className="font-display text-2xl md:text-3xl text-foreground leading-relaxed italic mb-8">
              &ldquo;{quotes[i].text}&rdquo;
            </p>
            <footer className="text-sm tracking-widest uppercase text-muted-foreground">
              {quotes[i].author} · <span className="text-[var(--burgundy)]/70">{quotes[i].role}</span>
            </footer>
          </blockquote>
        </div>
        <div className="flex justify-center gap-2 mt-10">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[var(--burgundy)]" : "w-1.5 bg-[var(--burgundy)]/20"}`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
