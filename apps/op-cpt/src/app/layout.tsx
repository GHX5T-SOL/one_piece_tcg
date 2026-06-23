import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Vault Room | Cards. Collectibles. Grails.",
  description: "Cape Town collector community for cards, collectibles, grails, trades, events, consignments and pre-grading.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
