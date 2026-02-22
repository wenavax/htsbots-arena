/**
 * HtsBots Arena - React/Phaser Bridge Component
 *
 * Wraps the Phaser game instance in a React component.
 * Dynamically imports Phaser to avoid SSR issues with Next.js.
 * Creates the game on mount and destroys it on unmount.
 */
"use client";

import { useEffect, useRef, useState } from "react";

export interface PhaserGameProps {
  /** Optional battle configuration (reserved for future use) */
  battleConfig?: {
    playerTeam?: string[];
    enemyTeam?: string[];
    difficulty?: "easy" | "normal" | "hard";
  };
  /** Callback when the game is destroyed (e.g., user clicks "Back to Menu") */
  onGameEnd?: () => void;
}

export default function PhaserGame({ battleConfig, onGameEnd }: PhaserGameProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    let game: Phaser.Game | null = null;
    let destroyed = false;

    const initGame = async () => {
      // Dynamic import to avoid SSR issues
      const Phaser = await import("phaser");
      const { createGameConfig } = await import("./config");

      if (destroyed || !gameContainerRef.current) return;

      const containerId = "phaser-game-container";
      gameContainerRef.current.id = containerId;

      const config = createGameConfig(containerId);
      game = new Phaser.Game(config);
      gameRef.current = game;

      // Listen for the game's destroy event to call onGameEnd
      game.events.on("destroy", () => {
        if (onGameEnd && !destroyed) {
          onGameEnd();
        }
      });

      setIsLoading(false);
    };

    initGame();

    return () => {
      destroyed = true;
      if (game) {
        game.destroy(true);
        game = null;
        gameRef.current = null;
      }
    };
  }, [onGameEnd]);

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-arena-darker">
          <p className="font-pixel text-xs text-neon-green text-glow-green animate-pulse">
            Initializing Battle Engine...
          </p>
        </div>
      )}
      <div
        ref={gameContainerRef}
        className="w-full aspect-[4/3] pixel-border bg-arena-dark overflow-hidden"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
