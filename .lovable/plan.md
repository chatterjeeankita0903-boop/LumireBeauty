
## Lumière Beauty — Build Plan

A luxury editorial beauty storefront. Reviews POST to an n8n webhook; dashboard reads via Google Sheets GViz JSON. No Supabase, no Apps Script.

### Stack & routing
- TanStack Start (file-based routes), React 19, TypeScript, Tailwind v4, Recharts.
- Routes: `src/routes/index.tsx` (home), `src/routes/products.$id.tsx` (PDP), `src/routes/dashboard.tsx` (protected).

### Design system (`src/styles.css`)
Add brand tokens to `:root` and register in `@theme inline`:
- `--ivory: #FAF7F2`, `--champagne: #E8D5B7`, `--blush: #F4C6C6`, `--burgundy: #6B1E3C`, `--gold: #C9A961`.
- Map: `--color-ivory`, `--color-champagne`, `--color-blush`, `--color-burgundy`, `--color-gold`.
- Override `--background` to ivory, `--primary` to burgundy.
- Load Playfair Display + Inter via Google Fonts in `__root.tsx` head; set font families `--font-display` (Playfair) and `--font-sans` (Inter).
- Utility classes: `.font-display`, `.fade-up` (IntersectionObserver-triggered).

### File structure
```
src/
  config/api.ts                 N8N_WEBHOOK_URL + SHEET_READ_URL
  data/products.ts              17-product static catalogue
  lib/format.ts                 INR formatter, star helpers
  lib/sheets.ts                 fetchReviews() — GViz parser
  hooks/useReviews.ts           polling 30s + per-product aggregates
  hooks/useWishlist.ts          localStorage
  hooks/useFadeUp.ts            IntersectionObserver
  components/
    Header.tsx                  logo, mobile hamburger, Dashboard lock button
    Footer.tsx
    Marquee.tsx                 scrolling banner
    Hero.tsx
    CategoryTabs.tsx
    ProductCard.tsx             image (gradient placeholder), badge, rating, ₹, heart
    WhyLumiere.tsx
    Testimonials.tsx            static carousel
    DashboardAuthModal.tsx      password modal, shake on wrong
    Chatbot/
      ChatbotLauncher.tsx       floating burgundy button + panel state (Zustand-lite via context)
      ChatPanel.tsx             tabs
      BeautyHelpTab.tsx         keyword Q&A over catalogue
      ReviewTab.tsx             7-step conversational form
      MessageBubble.tsx
      TypingIndicator.tsx
    dashboard/
      MetricCards.tsx
      FiltersBar.tsx
      ReviewsTable.tsx          sortable, expandable text
      ChartsSection.tsx         Recharts Bar + Pie
      ExportCsvButton.tsx
  routes/
    __root.tsx                  shell + fonts + Header + Chatbot mount + Footer
    index.tsx                   Hero + tabs + grid + Why + Testimonials
    products.$id.tsx            PDP w/ "Write a Review" → opens chatbot Review tab pre-filled
    dashboard.tsx               protected via sessionStorage check; redirect home if absent
```

### Data flow
- **Reviews read**: `lib/sheets.ts` fetches `SHEET_READ_URL`, strips GViz wrapper, returns typed `Review[]`. `useReviews()` polls every 30s, exposes rows + `avgByProduct`, `countByCategory`. Used by ProductCard ratings, PDP, dashboard.
- **Reviews write**: Chatbot Review tab → `fetch(N8N_WEBHOOK_URL, { method: "POST", body: JSON.stringify({ action:"append_review", reviewId:"LUM-"+Date.now(), timestamp:new Date().toISOString(), platform:"Lumière Web", ...form }) })`. Success toast + reset after 3s.
- **Cross-component chatbot open**: lightweight context (`ChatbotProvider`) with `openWithReview(product)` — PDP "Write a Review" calls it.

### Chatbot detail
- Floating burgundy circle bottom-right; click → 360×520 panel (full-width on mobile), header with pulsing green dot.
- **Beauty Help**: simple intent matcher — scans message for product names (case-insensitive) → returns claims + usage tip; "routine" → 3-step suggestion (cleanser → serum → moisturiser from catalogue); fallback prompt.
- **Leave a Review**: state machine `step: 1..7`; each step renders past assistant bubbles + active input. Inline validation (handle non-empty, review text ≥20 chars). Step 7 recap card + Edit/Submit.

### Dashboard
- Auth gate: read `sessionStorage.getItem("lumiere_auth")==="true"`; if not, redirect `/`. Header lock button opens `DashboardAuthModal` (password `lumiere2024`, shake animation on wrong).
- Components: 4 metric cards, filters (search + category + rating), sortable table, Recharts Bar (avg rating/product) + Pie (count/category), CSV export of filtered rows, "Last synced Xs ago" counter.

### Misc
- Per-route `head()` with title + description + og tags.
- Skeletons for grid + dashboard while loading.
- Sonner toasts already wired; use for "Review submitted ✨".
- Product imagery: tasteful CSS gradient tiles per category (no external assets) to keep build fast and on-brand.

After approval I'll implement in this order: tokens & shell → data/config → home + PDP → chatbot → dashboard auth + page → polish (animations, SEO, mobile nav).
