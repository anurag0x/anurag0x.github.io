import type { Metadata, Viewport } from "next";
import "./globals.css";

const ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2307070a'/><text x='50' y='68' font-size='58' text-anchor='middle' font-family='monospace' font-weight='700' fill='%23c6ff3d'>a_</text></svg>";

export const metadata: Metadata = {
  metadataBase: new URL("https://anurag0x.github.io"),
  title: "Anurag Kushwah — Tech All-Rounder",
  description: "Anurag Kushwah: tech all-rounder and software engineer — backend, frontend, mobile, AI/LLM and cloud. Currently at Animall.",
  icons: { icon: ICON },
  openGraph: {
    title: "Anurag Kushwah — Tech All-Rounder",
    description: "Scalable backends, real-time systems and AI/LLM products.",
    images: ["/image/anurag.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#07070a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;600&family=Instrument+Serif:ital@1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
