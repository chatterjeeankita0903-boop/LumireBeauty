import { useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChatbot } from "@/components/ChatbotContext";
import { BeautyHelpTab } from "./BeautyHelpTab";
import { ReviewTab } from "./ReviewTab";
import { cn } from "@/lib/utils";

export function ChatbotLauncher() {
  const { open, openChat, closeChat, tab, setTab } = useChatbot();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") closeChat(); };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, closeChat]);

  return (
    <>
      {!open && (
        <button
          onClick={() => openChat()}
          className="fixed z-40 bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--burgundy)] text-[var(--ivory)] shadow-2xl shadow-[var(--burgundy)]/40 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open Lumière assistant"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {open && (
        <div className="fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 slide-up">
          <div className="w-screen h-[100dvh] sm:w-[360px] sm:h-[560px] sm:rounded-2xl bg-[var(--ivory)] shadow-2xl border border-[var(--champagne)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[var(--burgundy)] text-[var(--ivory)] px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-display text-lg leading-none">Lumière Assistant</div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] opacity-90">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  Online
                </div>
              </div>
              <button onClick={closeChat} className="p-1.5 hover:bg-white/10 rounded-full" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 border-b border-[var(--champagne)]/40 bg-[var(--ivory)]">
              {(["help", "review"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "py-2.5 text-xs tracking-[0.2em] uppercase transition",
                    tab === t
                      ? "text-[var(--burgundy)] border-b-2 border-[var(--burgundy)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "help" ? "Beauty Help" : "Leave a Review"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              {tab === "help" ? <BeautyHelpTab /> : <ReviewTab />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
