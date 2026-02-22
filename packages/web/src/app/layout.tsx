import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HtsBots Arena | PvP Bot Battler on Base",
  description:
    "Build your bot army. Dominate the arena. Earn rewards. A blockchain PvP strategy game with pixel art style on Base chain.",
  keywords: [
    "blockchain game",
    "PvP",
    "Base chain",
    "NFT",
    "pixel art",
    "bot battler",
    "strategy game",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${pressStart2P.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-arena-darker text-gray-200 antialiased">
        <Providers>
          <div className="relative min-h-screen grid-bg">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
