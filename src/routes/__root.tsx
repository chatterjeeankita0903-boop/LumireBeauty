import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { ChatbotProvider } from "@/components/ChatbotContext";
import { ChatbotLauncher } from "@/components/Chatbot/ChatbotLauncher";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ivory)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[var(--burgundy)]">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has wandered off.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-[var(--burgundy)] text-[var(--ivory)] text-xs tracking-[0.25em] uppercase hover:bg-[var(--burgundy-deep)] transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumière Beauty — Luxury Beauty, Consciously Crafted" },
      { name: "description", content: "Luxury beauty: skincare, makeup, haircare and fragrance. Vegan, cruelty-free, dermatologist tested.
Get to know about our products & share your feedbacks" },
      { name: "author", content: "Lumière Beauty" },
      { property: "og:title", content: "Lumière Beauty — Luxury Beauty, Consciously Crafted" },
      { property: "og:description", content: "Luxury beauty: skincare, makeup, haircare and fragrance. Vegan, cruelty-free, dermatologist tested.
Get to know about our products & share your feedbacks" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Lumière Beauty — Luxury Beauty, Consciously Crafted" },
      { name: "twitter:description", content: "Luxury beauty: skincare, makeup, haircare and fragrance. Vegan, cruelty-free, dermatologist tested.
Get to know about our products & share your feedbacks" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/798e37f4-4aeb-4fdf-bd99-7a2b29f0f6ab/id-preview-bb9c0b5a--0d03e422-1c69-4735-b9a8-0f09b0e52d41.lovable.app-1776750486559.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/798e37f4-4aeb-4fdf-bd99-7a2b29f0f6ab/id-preview-bb9c0b5a--0d03e422-1c69-4735-b9a8-0f09b0e52d41.lovable.app-1776750486559.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ChatbotProvider>
      <div className="min-h-screen flex flex-col bg-[var(--ivory)]">
        <Marquee />
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ChatbotLauncher />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FAF7F2",
              color: "#6B1E3C",
              border: "1px solid #E8D5B7",
            },
          }}
        />
      </div>
    </ChatbotProvider>
  );
}
