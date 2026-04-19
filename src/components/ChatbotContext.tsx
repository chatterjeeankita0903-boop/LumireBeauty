import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

type Tab = "help" | "review";

interface ChatbotState {
  open: boolean;
  tab: Tab;
  prefillProduct: Product | null;
  openChat: (tab?: Tab) => void;
  closeChat: () => void;
  setTab: (t: Tab) => void;
  openWithReview: (p: Product) => void;
  consumePrefill: () => Product | null;
}

const Ctx = createContext<ChatbotState | null>(null);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("help");
  const [prefillProduct, setPrefillProduct] = useState<Product | null>(null);

  const openChat = useCallback((t?: Tab) => {
    if (t) setTab(t);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);
  const openWithReview = useCallback((p: Product) => {
    setPrefillProduct(p);
    setTab("review");
    setOpen(true);
  }, []);
  const consumePrefill = useCallback(() => {
    const p = prefillProduct;
    setPrefillProduct(null);
    return p;
  }, [prefillProduct]);

  return (
    <Ctx.Provider value={{ open, tab, prefillProduct, openChat, closeChat, setTab, openWithReview, consumePrefill }}>
      {children}
    </Ctx.Provider>
  );
}

export function useChatbot() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useChatbot must be used within ChatbotProvider");
  return c;
}
