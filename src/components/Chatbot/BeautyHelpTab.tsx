import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { products } from "@/data/products";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { N8N_WEBHOOK_URL } from "@/config/api";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

// Returns a local answer if the rule-based system can handle it, else null.
function localAnswer(input: string): string | null {
  const lower = input.toLowerCase();
  const match = products.find((p) => lower.includes(p.name.toLowerCase()));
  if (match) {
    const claims = match.claims.join(", ");
    const tip =
      match.category === "Skincare"
        ? "Use after cleansing, AM or PM. Always follow with SPF in the morning."
        : match.category === "Makeup"
        ? "Apply on prepped skin for best wear. A little goes a long way."
        : match.category === "Haircare"
        ? "Use on damp or dry hair. Focus on mid-lengths and ends."
        : match.category === "Bodycare"
        ? "Apply to clean, slightly damp skin to lock in moisture."
        : "Spritz on pulse points — wrists, neck, behind the ears.";
    return `${match.name} — ${match.tagline}\n\nKey claims: ${claims}.\n\nTip: ${tip}`;
  }
  if (lower.includes("routine")) {
    return "A simple Lumière 3-step routine:\n\n1. DermaClear Salicylic Acid Wash — cleanse\n2. GlowLab Vitamin C Serum — brighten (AM) or RetinolRich Night Cream (PM)\n3. AquaPlump Hyaluronic Serum — hydrate & seal\n\nFinish with SPF in the morning.";
  }
  return null;
}

async function askWebhook(message: string): Promise<string> {
  const isAnalysis = message.trim().toLowerCase() === "send analysis";
  const payload = isAnalysis
    ? { type: "analysis", message: "send analysis" }
    : { type: "chat", message };
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("bad response");
    const text = await res.text();
    let answer = "";
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        answer = data[0]?.message ?? data[0]?.answer ?? data[0]?.output ?? "";
      } else {
        answer = data.message ?? data.answer ?? data.output ?? data.reply ?? "";
      }
    } catch {
      answer = text;
    }
    return answer?.trim() || (isAnalysis ? "Analysis request sent ✨" : "I'm not sure about that just yet — try asking about one of our 17 products or your routine.");
  } catch (err) {
    console.error("[BeautyHelp] webhook error:", err);
    return "Sorry, I couldn't reach the assistant right now. Please try again in a moment.";
  }
}

export function BeautyHelpTab() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Welcome to Lumière. How may I guide you today? Ask about a product or routine." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = async () => {
    if (typing) return; // prevent duplicate submissions
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const isAnalysis = text.toLowerCase() === "send analysis";
    const local = isAnalysis ? null : localAnswer(text);
    if (local) {
      setTimeout(() => {
        setMsgs((m) => [...m, { role: "assistant", text: local }]);
        setTyping(false);
      }, 600);
      return;
    }
    const reply = await askWebhook(text);
    setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    setTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.map((m, i) => (
          <MessageBubble key={i} role={m.role}>
            <span className="whitespace-pre-line">{m.text}</span>
          </MessageBubble>
        ))}
        {typing && <TypingIndicator />}
        <div ref={endRef} />
      </div>
      <div className="border-t border-[var(--champagne)]/40 p-3 bg-[var(--ivory)]">
        <div className="flex items-center gap-2 bg-card border border-[var(--champagne)] rounded-full pl-4 pr-1 py-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Ask about a product…"
            className="flex-1 bg-transparent text-sm outline-none py-2"
          />
          <button
            onClick={send}
            disabled={typing}
            className="w-9 h-9 rounded-full bg-[var(--burgundy)] text-[var(--ivory)] flex items-center justify-center hover:bg-[var(--burgundy-deep)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
