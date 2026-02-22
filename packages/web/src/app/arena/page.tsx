"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const PhaserGame = dynamic(() => import("@/game/PhaserGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[800px] mx-auto aspect-[4/3] pixel-border bg-arena-dark flex items-center justify-center">
      <p className="font-pixel text-xs text-neon-green text-glow-green animate-pulse">
        Loading Arena...
      </p>
    </div>
  ),
});

export default function ArenaPage() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameEnd = useCallback(() => {
    setGameStarted(false);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-4 py-8">
      {!gameStarted ? (
        /* Pre-battle Lobby */
        <div className="pixel-border bg-arena-card p-8 sm:p-12 text-center max-w-2xl w-full relative scanlines">
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-neon-green/40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-neon-green/40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-neon-green/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-neon-green/40" />

          <div className="relative z-10">
            {/* Pixel art bot icon */}
            <pre className="font-mono text-neon-green text-glow-green text-xs sm:text-sm mb-8 leading-tight inline-block">
{`    ___
   [o.o]
   |=H=|
   /| |\\
  (_| |_)`}
            </pre>

            <h1 className="font-pixel text-xl sm:text-2xl text-neon-green text-glow-green mb-4">
              Arena
            </h1>

            <p className="font-mono text-xs text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
              Deploy your bot army in turn-based PvP combat.
              Strategize, attack, and dominate the battlefield.
            </p>

            {/* Team Preview */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="font-pixel text-[8px] text-neon-green mb-2">YOUR TEAM</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 pixel-border p-0 border-2 bg-arena-dark flex items-center justify-center">
                    <span className="font-pixel text-[6px] text-blue-400">TNK</span>
                  </div>
                  <div className="w-8 h-8 pixel-border p-0 border-2 bg-arena-dark flex items-center justify-center">
                    <span className="font-pixel text-[6px] text-red-400">DPS</span>
                  </div>
                  <div className="w-8 h-8 pixel-border p-0 border-2 bg-arena-dark flex items-center justify-center">
                    <span className="font-pixel text-[6px] text-green-400">HLR</span>
                  </div>
                </div>
              </div>

              <span className="font-pixel text-sm text-neon-cyan text-glow-cyan">VS</span>

              <div className="text-center">
                <p className="font-pixel text-[8px] text-red-400 mb-2">ENEMY TEAM</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 pixel-border-purple p-0 border-2 bg-arena-dark flex items-center justify-center">
                    <span className="font-pixel text-[6px] text-blue-400">TNK</span>
                  </div>
                  <div className="w-8 h-8 pixel-border-purple p-0 border-2 bg-arena-dark flex items-center justify-center">
                    <span className="font-pixel text-[6px] text-red-400">DPS</span>
                  </div>
                  <div className="w-8 h-8 pixel-border-purple p-0 border-2 bg-arena-dark flex items-center justify-center">
                    <span className="font-pixel text-[6px] text-purple-400">SUP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Info */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="font-pixel text-sm text-neon-cyan text-glow-cyan">3v3</p>
                <p className="font-pixel text-[7px] text-gray-500 mt-1">Format</p>
              </div>
              <div className="h-6 w-px bg-arena-border" />
              <div className="text-center">
                <p className="font-pixel text-sm text-neon-purple text-glow-purple">DEMO</p>
                <p className="font-pixel text-[7px] text-gray-500 mt-1">Mode</p>
              </div>
              <div className="h-6 w-px bg-arena-border" />
              <div className="text-center">
                <p className="font-pixel text-sm text-neon-yellow">10</p>
                <p className="font-pixel text-[7px] text-gray-500 mt-1">HTSB Reward</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setGameStarted(true)}
                className="pixel-btn pixel-btn-primary text-[10px]"
              >
                Start Battle
              </button>
              <Link href="/" className="pixel-btn pixel-btn-secondary text-[10px]">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Active Battle */
        <div className="w-full max-w-[860px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-xs text-neon-green text-glow-green">
              HtsBots Arena - Live Battle
            </h2>
            <button
              onClick={() => setGameStarted(false)}
              className="font-pixel text-[8px] text-gray-500 hover:text-red-400 transition-colors"
            >
              [ EXIT ]
            </button>
          </div>

          <PhaserGame
            battleConfig={{
              difficulty: "normal",
            }}
            onGameEnd={handleGameEnd}
          />

          <div className="mt-4 text-center">
            <p className="font-pixel text-[7px] text-gray-600">
              Click bots to target | Use action buttons to command your team
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
