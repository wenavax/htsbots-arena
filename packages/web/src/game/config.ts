/**
 * HtsBots Arena - Phaser Game Configuration
 *
 * 800x600 pixel-art-style canvas with dark background.
 * Scenes are registered in boot order.
 */
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { BattleScene } from "./scenes/BattleScene";
import { VictoryScene } from "./scenes/VictoryScene";

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    backgroundColor: "#0A0A0F",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, BattleScene, VictoryScene],
  };
}
