import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OP CPT | Cape Town One Piece TCG Community",
  description: "Cape Town's Grand Line for cards, battles, and trades.",
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
