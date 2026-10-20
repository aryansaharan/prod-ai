import type { Metadata, Viewport } from "next";
import { Archivo, Architects_Daughter, Caveat, Hanken_Grotesk, JetBrains_Mono, Newsreader, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import { StudioAnalytics } from "@/components/analytics";
import "./globals.css";

// Pencil for thinking (titles, notes, sketches), a clear grotesk for the tool, a mono for code.
const pencil = Caveat({ variable: "--font-pencil", subsets: ["latin"] });
const sketch = Architects_Daughter({ variable: "--font-sketch", subsets: ["latin"], weight: "400" });
const sans = Hanken_Grotesk({ variable: "--font-work", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"] });
// The faces some looks give the apps people make (lib/looks.ts). Not preloaded: a browser fetches one only when an app wears its look.
const lookSerif = Newsreader({ variable: "--font-look-serif", subsets: ["latin"], preload: false });
const lookRound = Nunito({ variable: "--font-look-round", subsets: ["latin"], preload: false });
const lookGrotesk = Archivo({ variable: "--font-look-grotesk", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: { default: "Prod AI: agentic apps you'd trust in production", template: "%s · Prod AI" },
  description:
    "Describe an agentic app. Prod AI plans it, prices it, builds it and shows its work, for the people who don't code and the people who do, in the same project.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = { themeColor: "#f7f5f0", colorScheme: "light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pencil.variable} ${sketch.variable} ${sans.variable} ${mono.variable} ${lookSerif.variable} ${lookRound.variable} ${lookGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </Providers>
        <Toaster position="bottom-right" />
        <StudioAnalytics />
      </body>
    </html>
  );
}
