import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Menu, X } from "lucide-react";
import { DashboardAuthModal } from "./DashboardAuthModal";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const navLinks = (
    <>
      <Link to="/" className="text-sm tracking-wider hover:text-[var(--burgundy)] transition" activeProps={{ className: "text-[var(--burgundy)] font-medium" }} activeOptions={{ exact: true }}>
        HOME
      </Link>
      <a href="/#collection" className="text-sm tracking-wider hover:text-[var(--burgundy)] transition">COLLECTION</a>
      <a href="/#why" className="text-sm tracking-wider hover:text-[var(--burgundy)] transition">PHILOSOPHY</a>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ivory)]/85 backdrop-blur-md border-b border-[var(--champagne)]/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-tight text-[var(--burgundy)]">
            Lumière<span className="text-[var(--gold)]">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">{navLinks}</nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs tracking-widest text-foreground/70 hover:text-[var(--burgundy)] transition"
              aria-label="Dashboard"
            >
              <Lock size={13} />
              DASHBOARD
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 -mr-2"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--champagne)]/40 bg-[var(--ivory)] slide-up">
            <nav className="flex flex-col px-6 py-5 gap-4" onClick={() => setMobileOpen(false)}>
              {navLinks}
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-2 text-sm tracking-widest text-foreground/70"
              >
                <Lock size={14} /> DASHBOARD
              </button>
            </nav>
          </div>
        )}
      </header>
      <DashboardAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
