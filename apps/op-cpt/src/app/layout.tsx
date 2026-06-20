import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Vault Room | Cards. Collectibles. Grails.",
  description: "Cape Town collector community for cards, collectibles, grails, trades, events, consignments and pre-grading.",
  icons: {
    icon: "/favicon.svg"
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
