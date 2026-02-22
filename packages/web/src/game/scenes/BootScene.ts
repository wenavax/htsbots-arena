/**
 * HtsBots Arena - Boot / Preload Scene
 *
 * Generates all placeholder pixel-art sprites programmatically using Phaser
 * graphics. No external image assets are required.
 *
 * Generated textures:
 *  - bot_tank (32x32, blue)
 *  - bot_dps (32x32, red)
 *  - bot_healer (32x32, green)
 *  - bot_support (32x32, purple)
 *  - hp_bar_bg (40x6, dark gray)
 *  - hp_bar_fill (40x6, green)
 *  - attack_fx (16x16, yellow burst)
 *  - heal_fx (16x16, green cross)
 *  - shield_fx (20x20, blue outline)
 *  - particle (4x4, white)
 */
import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    // Nothing to load from disk - everything is generated
  }

  create(): void {
    // -- Loading text --
    const loadText = this.add
      .text(400, 280, "Loading...", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "14px",
        color: "#39FF14",
      })
      .setOrigin(0.5);

    // Blink the loading text
    this.tweens.add({
      targets: loadText,
      alpha: 0.3,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // -- Generate bot sprites --
    this.generateBotTexture("bot_tank", 0x3388ff, 0x2266cc);
    this.generateBotTexture("bot_dps", 0xff4444, 0xcc2222);
    this.generateBotTexture("bot_healer", 0x44ff66, 0x22cc44);
    this.generateBotTexture("bot_support", 0xbb55ff, 0x8833cc);

    // -- HP bar textures --
    this.generateHpBarTextures();

    // -- Effect textures --
    this.generateAttackFx();
    this.generateHealFx();
    this.generateShieldFx();
    this.generateParticle();

    // -- Arena floor tile --
    this.generateFloorTile();

    // Transition to battle after a brief delay
    this.time.delayedCall(800, () => {
      this.scene.start("BattleScene");
    });
  }

  /** Generates a 32x32 pixel-art bot sprite with head, body, eyes, and antenna. */
  private generateBotTexture(key: string, primary: number, secondary: number): void {
    const size = 32;
    const g = this.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRect(4, 26, 24, 4);

    // Body (main block)
    g.fillStyle(secondary);
    g.fillRect(6, 12, 20, 14);

    // Body highlight
    g.fillStyle(primary);
    g.fillRect(8, 14, 16, 10);

    // Head
    g.fillStyle(primary);
    g.fillRect(8, 2, 16, 12);

    // Head outline / visor
    g.fillStyle(secondary);
    g.fillRect(8, 2, 16, 2);
    g.fillRect(8, 12, 16, 2);
    g.fillRect(8, 2, 2, 12);
    g.fillRect(22, 2, 2, 12);

    // Eyes (white + dark pupils)
    g.fillStyle(0xffffff);
    g.fillRect(12, 6, 4, 4);
    g.fillRect(18, 6, 4, 4);
    g.fillStyle(0x111111);
    g.fillRect(14, 7, 2, 2);
    g.fillRect(20, 7, 2, 2);

    // Antenna
    g.fillStyle(0xffff00);
    g.fillRect(15, 0, 2, 3);

    // Arms
    g.fillStyle(secondary);
    g.fillRect(2, 14, 4, 8);
    g.fillRect(26, 14, 4, 8);

    // Legs
    g.fillStyle(secondary);
    g.fillRect(10, 26, 4, 4);
    g.fillRect(18, 26, 4, 4);

    // Class icon on chest (small 4x4)
    g.fillStyle(0xffffff, 0.8);
    switch (key) {
      case "bot_tank":
        // Shield icon
        g.fillRect(14, 16, 4, 2);
        g.fillRect(13, 18, 6, 2);
        g.fillRect(14, 20, 4, 2);
        break;
      case "bot_dps":
        // Sword icon
        g.fillRect(15, 15, 2, 6);
        g.fillRect(13, 17, 6, 2);
        break;
      case "bot_healer":
        // Cross icon
        g.fillRect(15, 15, 2, 6);
        g.fillRect(13, 17, 6, 2);
        break;
      case "bot_support":
        // Star icon
        g.fillRect(15, 15, 2, 2);
        g.fillRect(13, 17, 6, 2);
        g.fillRect(15, 19, 2, 2);
        break;
    }

    g.generateTexture(key, size, size + 2);
    g.destroy();
  }

  /** HP bar background and fill textures. */
  private generateHpBarTextures(): void {
    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x222222);
    bg.fillRect(0, 0, 40, 6);
    bg.lineStyle(1, 0x444444);
    bg.strokeRect(0, 0, 40, 6);
    bg.generateTexture("hp_bar_bg", 40, 6);
    bg.destroy();

    // Fill (green)
    const fill = this.add.graphics();
    fill.fillStyle(0x39ff14);
    fill.fillRect(0, 0, 40, 6);
    fill.generateTexture("hp_bar_fill", 40, 6);
    fill.destroy();

    // Fill (yellow, for medium HP)
    const fillYellow = this.add.graphics();
    fillYellow.fillStyle(0xdfff00);
    fillYellow.fillRect(0, 0, 40, 6);
    fillYellow.generateTexture("hp_bar_yellow", 40, 6);
    fillYellow.destroy();

    // Fill (red, for low HP)
    const fillRed = this.add.graphics();
    fillRed.fillStyle(0xff4444);
    fillRed.fillRect(0, 0, 40, 6);
    fillRed.generateTexture("hp_bar_red", 40, 6);
    fillRed.destroy();
  }

  /** Yellow burst attack effect (16x16). */
  private generateAttackFx(): void {
    const g = this.add.graphics();
    // Starburst pattern
    g.fillStyle(0xffff00, 0.9);
    g.fillRect(6, 0, 4, 16);
    g.fillRect(0, 6, 16, 4);
    g.fillStyle(0xffffff, 0.7);
    g.fillRect(7, 1, 2, 14);
    g.fillRect(1, 7, 14, 2);
    // Diagonal accents
    g.fillStyle(0xffaa00, 0.8);
    g.fillRect(2, 2, 4, 4);
    g.fillRect(10, 2, 4, 4);
    g.fillRect(2, 10, 4, 4);
    g.fillRect(10, 10, 4, 4);
    g.generateTexture("attack_fx", 16, 16);
    g.destroy();
  }

  /** Green cross heal effect (16x16). */
  private generateHealFx(): void {
    const g = this.add.graphics();
    g.fillStyle(0x39ff14, 0.9);
    g.fillRect(6, 0, 4, 16);
    g.fillRect(0, 6, 16, 4);
    g.fillStyle(0xaaffaa, 0.6);
    g.fillRect(7, 1, 2, 14);
    g.fillRect(1, 7, 14, 2);
    g.generateTexture("heal_fx", 16, 16);
    g.destroy();
  }

  /** Blue shield effect outline (20x20). */
  private generateShieldFx(): void {
    const g = this.add.graphics();
    g.lineStyle(2, 0x3388ff, 0.8);
    g.strokeRoundedRect(2, 2, 16, 16, 4);
    g.fillStyle(0x3388ff, 0.15);
    g.fillRoundedRect(2, 2, 16, 16, 4);
    g.generateTexture("shield_fx", 20, 20);
    g.destroy();
  }

  /** Small 4x4 particle for effects. */
  private generateParticle(): void {
    const g = this.add.graphics();
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture("particle", 4, 4);
    g.destroy();
  }

  /** Simple tiled arena floor (64x64 dark grid). */
  private generateFloorTile(): void {
    const g = this.add.graphics();
    g.fillStyle(0x111118);
    g.fillRect(0, 0, 64, 64);
    g.lineStyle(1, 0x1a1a2a, 0.5);
    g.strokeRect(0, 0, 64, 64);
    // Grid lines
    g.lineStyle(1, 0x151520, 0.3);
    g.lineBetween(32, 0, 32, 64);
    g.lineBetween(0, 32, 64, 32);
    g.generateTexture("floor_tile", 64, 64);
    g.destroy();
  }
}
