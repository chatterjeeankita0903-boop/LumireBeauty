export function Marquee() {
  const items = [
    "Free shipping on orders above ₹2,499",
    "Dermatologist Tested",
    "Cruelty Free",
    "Vegan Formulas",
  ];
  const content = (
    <div className="marquee-track text-xs uppercase tracking-[0.25em]">
      {[...items, ...items, ...items].map((t, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>{t}</span>
          <span aria-hidden className="opacity-40">·</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee bg-[var(--burgundy)] text-[var(--ivory)] py-2.5">
      {content}
    </div>
  );
}
