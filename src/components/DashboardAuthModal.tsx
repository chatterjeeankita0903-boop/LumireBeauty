import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PASSWORD = "lumiere2024";

export function DashboardAuthModal({ open, onClose }: Props) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setPw("");
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem("lumiere_auth", "true");
      onClose();
      navigate({ to: "/dashboard" });
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[var(--burgundy-deep)]/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className={`relative scale-in w-full max-w-sm bg-card border border-[var(--champagne)] p-8 shadow-2xl ${error ? "shake" : ""}`}
      >
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[var(--burgundy)]/10 flex items-center justify-center text-[var(--burgundy)]">
            <Lock size={18} />
          </div>
        </div>
        <h2 className="font-display text-2xl text-center text-[var(--burgundy-deep)] mb-2">Dashboard Access</h2>
        <p className="text-xs text-center text-muted-foreground tracking-wider mb-6">Enter access code to continue</p>
        <input
          ref={inputRef}
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Access code"
          className="w-full px-4 py-3 bg-[var(--ivory)] border border-[var(--champagne)] focus:border-[var(--burgundy)] outline-none text-sm tracking-widest text-center"
        />
        {error && (
          <p className="text-xs text-destructive text-center mt-2">Incorrect access code</p>
        )}
        <button
          type="submit"
          className="w-full mt-5 py-3 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-[0.25em] uppercase hover:bg-[var(--burgundy-deep)] transition-colors"
        >
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}
