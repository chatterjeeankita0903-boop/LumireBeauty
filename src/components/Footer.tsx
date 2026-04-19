export function Footer() {
  return (
    <footer className="bg-[var(--burgundy-deep)] text-[var(--ivory)] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-display text-3xl mb-4">
            Lumière<span className="text-[var(--gold)]">.</span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--ivory)]/70 max-w-sm">
            Luxury beauty, consciously crafted in small batches. Dermatologist tested,
            cruelty free, vegan formulas — designed to elevate your daily ritual.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.25em] uppercase mb-4 text-[var(--champagne)]">Shop</h4>
          <ul className="space-y-2 text-sm text-[var(--ivory)]/80">
            <li>Skincare</li><li>Makeup</li><li>Haircare</li><li>Fragrance</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.25em] uppercase mb-4 text-[var(--champagne)]">House</h4>
          <ul className="space-y-2 text-sm text-[var(--ivory)]/80">
            <li>Our story</li><li>Sustainability</li><li>Press</li><li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--ivory)]/10 py-6 text-center text-xs text-[var(--ivory)]/50 tracking-wider">
        © {new Date().getFullYear()} Lumière Beauty · Made with care
      </div>
    </footer>
  );
}
