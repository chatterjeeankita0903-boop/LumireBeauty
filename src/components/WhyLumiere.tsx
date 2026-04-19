import { Leaf, Sparkles, HeartHandshake } from "lucide-react";
import { useFadeUp } from "@/hooks/useFadeUp";

const items = [
  {
    icon: Sparkles,
    title: "Editorial Formulations",
    body: "Each product is composed like a fragrance — every note considered, every claim earned.",
  },
  {
    icon: Leaf,
    title: "Conscious Beauty",
    body: "Vegan, cruelty-free, dermatologist tested. Sustainable packaging, refill-ready by design.",
  },
  {
    icon: HeartHandshake,
    title: "Made for Rituals",
    body: "Slow beauty, intentional moments. We design to elevate your daily care into ceremony.",
  },
];

export function WhyLumiere() {
  const ref = useFadeUp<HTMLDivElement>();
  return (
    <section id="why" className="bg-[var(--champagne)]/20 py-24">
      <div ref={ref} className="fade-up max-w-6xl mx-auto px-6 lg:px-10 text-center">
        <p className="text-xs tracking-[0.4em] text-[var(--burgundy)] uppercase mb-4">Our Philosophy</p>
        <h2 className="font-display text-4xl md:text-5xl text-[var(--burgundy-deep)] mb-16">Why Lumière?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="px-4">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--ivory)] flex items-center justify-center text-[var(--burgundy)] border border-[var(--champagne)]">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
