"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/arena", label: "Arena" },
  { href: "/marketplace", label: "Market" },
  { href: "/leaderboard", label: "Ranks" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-arena-border bg-arena-darker/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center pixel-border text-neon-green font-pixel text-xs">
            HB
          </div>
          <span className="hidden sm:block font-pixel text-xs text-neon-green text-glow-green group-hover:text-neon-cyan transition-colors">
            HtsBots
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  font-pixel text-[8px] sm:text-[10px] px-2 sm:px-3 py-2
                  transition-all duration-200 relative
                  ${
                    isActive
                      ? "text-neon-green text-glow-green"
                      : "text-gray-400 hover:text-neon-cyan"
                  }
                `}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-neon-green shadow-neon-green" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Wallet Connect */}
        <div className="flex items-center">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus="address"
          />
        </div>
      </div>
    </nav>
  );
}
