import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, type Category, productsByCategory, getProduct } from "@/data/products";
import { N8N_WEBHOOK_URL } from "@/config/api";
import { useChatbot } from "@/components/ChatbotContext";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Form {
  userHandle: string;
  productCategory: Category | "";
  productName: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
}

const empty: Form = {
  userHandle: "",
  productCategory: "",
  productName: "",
  rating: 0,
  reviewTitle: "",
  reviewText: "",
};

const stepPrompts: Record<number, (f: Form) => string> = {
  1: () => "Hi! We'd love to hear from you. What's your name or handle?",
  2: () => "Lovely. Which product category are you reviewing?",
  3: () => "Which product would you like to review?",
  4: (f) => `How would you rate ${f.productName}?`,
  5: () => "Give your review a title.",
  6: () => "Tell us more about your experience.",
  7: () => "Here's your review summary:",
};

export function ReviewTab() {
  const { consumePrefill } = useChatbot();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<Form>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    { role: "assistant", text: stepPrompts[1](empty) },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  // Apply prefill once
  useEffect(() => {
    const p = consumePrefill();
    if (p) {
      const next: Form = { ...empty, productCategory: p.category, productName: p.name };
      setForm(next);
      setStep(4);
      setHistory([
        { role: "assistant", text: stepPrompts[1](empty) },
        { role: "user", text: "(coming from product page)" },
        { role: "assistant", text: stepPrompts[2](empty) },
        { role: "user", text: p.category },
        { role: "assistant", text: stepPrompts[3](empty) },
        { role: "user", text: p.name },
        { role: "assistant", text: stepPrompts[4](next) },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, step, submitting]);

  const advance = (userText: string, nextStep: Step, mutated: Form) => {
    const newHistory: typeof history = [
      ...history,
      { role: "user", text: userText },
    ];
    if (nextStep <= 7) {
      newHistory.push({ role: "assistant", text: stepPrompts[nextStep](mutated) });
    }
    setHistory(newHistory);
    setStep(nextStep);
    setError(null);
  };

  const restart = () => {
    setForm(empty);
    setStep(1);
    setDone(false);
    setError(null);
    setHistory([{ role: "assistant", text: stepPrompts[1](empty) }]);
  };

  // Step inputs
  const [tmp, setTmp] = useState("");
  useEffect(() => { setTmp(""); }, [step]);

  const handleHandle = () => {
    const v = tmp.trim();
    if (!v) return setError("Please enter your name or handle.");
    const next = { ...form, userHandle: v };
    setForm(next);
    advance(v, 2, next);
  };
  const handleCategory = (cat: Category) => {
    const next = { ...form, productCategory: cat, productName: "" };
    setForm(next);
    advance(cat, 3, next);
  };
  const handleProduct = (name: string) => {
    const next = { ...form, productName: name };
    setForm(next);
    advance(name, 4, next);
  };
  const handleRating = (r: number) => {
    const next = { ...form, rating: r };
    setForm(next);
    advance(`${r} ★`, 5, next);
  };
  const handleTitle = () => {
    const v = tmp.trim();
    if (!v) return setError("Please add a title.");
    const next = { ...form, reviewTitle: v };
    setForm(next);
    advance(v, 6, next);
  };
  const handleText = () => {
    const v = tmp.trim();
    if (v.length < 20) return setError("Please write at least 20 characters.");
    const next = { ...form, reviewText: v };
    setForm(next);
    advance(v, 7, next);
  };

  const submit = async () => {
    if (submitting) return; // prevent duplicate submissions
    setSubmitting(true);
    setError(null);
    const payload = {
      type: "review",
      action: "append_review",
      reviewId: "LUM-" + Date.now(),
      timestamp: new Date().toISOString(),
      platform: "Lumière Web",
      productCategory: form.productCategory,
      productName: form.productName,
      rating: Number(form.rating),
      reviewTitle: form.reviewTitle,
      reviewText: form.reviewText,
      userHandle: form.userHandle,
    };
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Bad response");
      let status: string | undefined;
      try {
        const data = await res.clone().json();
        status = Array.isArray(data) ? data[0]?.status : data?.status;
      } catch {
        // non-JSON response — treat 2xx as success
      }
      if (status === "error") throw new Error("Backend reported error");
      setDone(true);
      setHistory((h) => [...h, { role: "user", text: "Submit Review" }, { role: "assistant", text: "Thank you! Your review has been submitted. 🌸" }]);
      toast.success("Review submitted ✨");
      setTimeout(restart, 3000);
    } catch (err) {
      console.error("[ReviewTab] submit error:", err);
      setHistory((h) => [...h, { role: "assistant", text: "Oops, something went wrong. Please try again." }]);
      toast.error("Couldn't submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = form.productCategory ? productsByCategory(form.productCategory) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {history.map((m, i) => (
          <MessageBubble key={i} role={m.role}>
            <span className="whitespace-pre-line">{m.text}</span>
          </MessageBubble>
        ))}

        {step === 7 && !done && (
          <div className="bg-card border border-[var(--champagne)] p-4 rounded-2xl space-y-2 text-sm slide-up">
            <Row label="Handle" value={form.userHandle} />
            <Row label="Category" value={form.productCategory} />
            <Row label="Product" value={form.productName} />
            <Row label="Rating" value={`${form.rating} ★`} />
            <Row label="Title" value={form.reviewTitle} />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Review</div>
              <div className="text-foreground">{form.reviewText}</div>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-destructive px-1">{error}</p>}

        <div ref={endRef} />
      </div>

      {/* Active input area */}
      {!done && (
        <div className="border-t border-[var(--champagne)]/40 p-3 bg-[var(--ivory)]">
          {step === 1 && (
            <TextInline value={tmp} onChange={setTmp} placeholder="@yourname" onSubmit={handleHandle} />
          )}
          {step === 2 && (
            <Pills options={CATEGORIES} onPick={(v) => handleCategory(v as Category)} />
          )}
          {step === 3 && (
            <select
              value=""
              onChange={(e) => e.target.value && handleProduct(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-[var(--champagne)] focus:border-[var(--burgundy)] outline-none text-sm rounded-full"
            >
              <option value="">Choose a product…</option>
              {filteredProducts.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          )}
          {step === 4 && (
            <div className="flex justify-center gap-2 py-2">
              {[1,2,3,4,5].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRating(r)}
                  className="p-2 hover:scale-110 transition-transform"
                  aria-label={`${r} stars`}
                >
                  <Star size={28} className="text-[var(--gold)]" />
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <TextInline value={tmp} onChange={setTmp} placeholder="e.g. Life-changing serum!" onSubmit={handleTitle} />
          )}
          {step === 6 && (
            <div className="space-y-2">
              <textarea
                value={tmp}
                onChange={(e) => setTmp(e.target.value)}
                placeholder="What did you love? Any tips for others?"
                rows={3}
                className="w-full px-4 py-2.5 bg-card border border-[var(--champagne)] focus:border-[var(--burgundy)] outline-none text-sm rounded-2xl resize-none"
              />
              <div className="flex justify-between items-center">
                <span className={cn("text-[11px]", tmp.length < 20 ? "text-muted-foreground" : "text-[var(--burgundy)]")}>
                  {tmp.length}/20 min
                </span>
                <button
                  onClick={handleText}
                  className="px-4 py-1.5 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-widest uppercase rounded-full hover:bg-[var(--burgundy-deep)]"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {step === 7 && (
            <div className="flex gap-2">
              <button
                onClick={restart}
                disabled={submitting}
                className="flex-1 py-2.5 border border-[var(--burgundy)] text-[var(--burgundy)] text-xs tracking-widest uppercase rounded-full hover:bg-[var(--burgundy)]/5 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 py-2.5 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-widest uppercase rounded-full hover:bg-[var(--burgundy-deep)] disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  );
}

function TextInline({ value, onChange, placeholder, onSubmit }: { value: string; onChange: (v: string) => void; placeholder: string; onSubmit: () => void; }) {
  return (
    <div className="flex items-center gap-2 bg-card border border-[var(--champagne)] rounded-full pl-4 pr-1 py-1">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none py-2"
      />
      <button
        onClick={onSubmit}
        className="px-4 h-9 rounded-full bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-widest uppercase hover:bg-[var(--burgundy-deep)]"
      >
        Next
      </button>
    </div>
  );
}

function Pills({ options, onPick }: { options: readonly string[]; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onPick(o)}
          className="px-4 py-2 text-xs tracking-widest uppercase border border-[var(--champagne)] hover:border-[var(--burgundy)] hover:text-[var(--burgundy)] rounded-full transition"
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// Avoid unused-import warning for getProduct
void getProduct;
