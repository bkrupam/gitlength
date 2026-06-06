import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";

const openRunde = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-open-runde-loaded",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat-loaded",
});

export const metadata: Metadata = {
  title: "Gitlength — Trending to Micro-SaaS Ideas",
  description:
    "Browse GitHub trending repositories and generate micro-SaaS ideas powered by Groq.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openRunde.variable} ${caveat.variable}`}>
        {children}
      </body>
    </html>
  );
}
