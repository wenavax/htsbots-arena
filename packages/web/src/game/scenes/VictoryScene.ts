/**
 * HtsBots Arena - Victory / Defeat Scene
 *
 * Post-battle screen showing result, rewards, and navigation buttons.
 */
import Phaser from "phaser";

const FONT_PIXEL = '"Press Start 2P", monospace';

export class VictoryScene extends Phaser.Scene {
  private playerWon: boolean = true;

  constructor() {
    super({ key: "VictoryScene" });
  }

  init(data: { playerWon: boolean }): void {
    this.playerWon = data.playerWon ?? true;
  }

  create(): void {
    // -- Background --
    this.cameras.main.setBackgroundColor("#0A0A0F");

    // Decorative grid
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x1a1a2a, 0.3);
    for (let x = 0; x < 800; x += 32) {
      grid.lineBetween(x, 0, x, 600);
    }
    for (let y = 0; y < 600; y += 32) {
      grid.lineBetween(0, y, 800, y);
    }

    // Corner decorations
    const corners = this.add.graphics();
    const accentColor = this.playerWon ? 0x39ff14 : 0xff4444;
    corners.lineStyle(2, accentColor, 0.4);
    corners.lineBetween(20, 20, 60, 20);
    corners.lineBetween(20, 20, 20, 60);
    corners.lineBetween(740, 20, 780, 20);
    corners.lineBetween(780, 20, 780, 60);
    corners.lineBetween(20, 540, 20, 580);
    corners.lineBetween(20, 580, 60, 580);
    corners.lineBetween(780, 540, 780, 580);
    corners.lineBetween(740, 580, 780, 580);

    // -- Result section --
    const resultText = this.playerWon ? "VICTORY!" : "DEFEAT";
    const resultColor = this.playerWon ? "#39FF14" : "#FF4444";
    const resultShadow = this.playerWon ? "#39FF14" : "#FF4444";

    // Animated bot icon (simple ASCII)
    const botIcon = this.playerWon
      ? "  [^.^]\n  |=H=|\n  /| |\\"
      : "  [x.x]\n  |=H=|\n  /| |\\";

    this.add
      .text(400, 120, botIcon, {
        fontFamily: FONT_PIXEL,
        fontSize: "12px",
        color: resultColor,
        align: "center",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, resultShadow, 8);

    // Main result text
    const mainLabel = this.add
      .text(400, 200, resultText, {
        fontFamily: FONT_PIXEL,
        fontSize: "28px",
        color: resultColor,
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setShadow(0, 0, resultShadow, 16);

    this.tweens.add({
      targets: mainLabel,
      alpha: 1,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 500,
      ease: "Back.easeOut",
    });

    // Pulsing glow on the result text
    this.tweens.add({
      targets: mainLabel,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // -- Rewards panel --
    const panelX = 280;
    const panelY = 260;
    const panelW = 240;
    const panelH = 120;

    const panel = this.add.graphics();
    panel.fillStyle(0x12121a, 0.9);
    panel.fillRect(panelX, panelY, panelW, panelH);
    panel.lineStyle(2, accentColor, 0.5);
    panel.strokeRect(panelX, panelY, panelW, panelH);

    this.add
      .text(400, panelY + 16, "BATTLE REWARDS", {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: "#00FFFF",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#00FFFF", 4);

    // Divider line
    const divider = this.add.graphics();
    divider.lineStyle(1, 0x1e1e2e, 0.8);
    divider.lineBetween(panelX + 10, panelY + 32, panelX + panelW - 10, panelY + 32);

    // Rewards
    const tokenReward = this.playerWon ? "+10 HTSB" : "+2 HTSB";
    const xpReward = this.playerWon ? "+50 XP" : "+10 XP";

    // Token reward
    this.add
      .text(panelX + 20, panelY + 44, "Tokens:", {
        fontFamily: FONT_PIXEL,
        fontSize: "7px",
        color: "#888899",
      });

    const tokenText = this.add
      .text(panelX + panelW - 20, panelY + 44, tokenReward, {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: "#DFFF00",
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    // XP reward
    this.add
      .text(panelX + 20, panelY + 64, "Experience:", {
        fontFamily: FONT_PIXEL,
        fontSize: "7px",
        color: "#888899",
      });

    const xpText = this.add
      .text(panelX + panelW - 20, panelY + 64, xpReward, {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: "#00FFFF",
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    // Rank change
    const rankText = this.add
      .text(panelX + 20, panelY + 84, "Rating:", {
        fontFamily: FONT_PIXEL,
        fontSize: "7px",
        color: "#888899",
      });

    const rankChange = this.playerWon ? "+15" : "-8";
    const rankColor = this.playerWon ? "#39FF14" : "#FF4444";
    const rankValue = this.add
      .text(panelX + panelW - 20, panelY + 84, rankChange, {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: rankColor,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    // Animate rewards appearing sequentially
    this.tweens.add({
      targets: tokenText,
      alpha: 1,
      x: { from: panelX + panelW + 20, to: panelX + panelW - 20 },
      delay: 400,
      duration: 300,
      ease: "Quad.easeOut",
    });
    this.tweens.add({
      targets: xpText,
      alpha: 1,
      x: { from: panelX + panelW + 20, to: panelX + panelW - 20 },
      delay: 600,
      duration: 300,
      ease: "Quad.easeOut",
    });
    this.tweens.add({
      targets: rankValue,
      alpha: 1,
      x: { from: panelX + panelW + 20, to: panelX + panelW - 20 },
      delay: 800,
      duration: 300,
      ease: "Quad.easeOut",
    });

    // -- Floating particles in background --
    this.spawnBackgroundParticles(accentColor);

    // -- Buttons --
    this.createButton(300, 440, "PLAY AGAIN", "#39FF14", 0x114411, () => {
      this.scene.start("BattleScene");
    });

    this.createButton(500, 440, "BACK TO MENU", "#BF40FF", 0x221133, () => {
      // Destroy the Phaser game - the React component will handle navigation
      this.game.destroy(true);
    });

    // -- Stats summary (bottom) --
    this.add
      .text(400, 510, "Battle Complete  |  Round Score Calculated", {
        fontFamily: FONT_PIXEL,
        fontSize: "6px",
        color: "#444466",
      })
      .setOrigin(0.5);

    // Decorative bottom bar
    const bottomBar = this.add.graphics();
    bottomBar.lineStyle(1, accentColor, 0.2);
    bottomBar.lineBetween(100, 540, 700, 540);
  }

  /** Creates a styled pixel-art button. */
  private createButton(
    x: number,
    y: number,
    label: string,
    color: string,
    bgColor: number,
    onClick: () => void
  ): void {
    const btnW = 160;
    const btnH = 36;

    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.85);
    bg.fillRect(-btnW / 2, -btnH / 2, btnW, btnH);
    bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.9);
    bg.strokeRect(-btnW / 2, -btnH / 2, btnW, btnH);
    container.add(bg);

    const text = this.add
      .text(0, 0, label, {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: color,
      })
      .setOrigin(0.5);
    container.add(text);

    const hitArea = this.add
      .zone(0, 0, btnW, btnH)
      .setInteractive({ useHandCursor: true });
    container.add(hitArea);

    hitArea.on("pointerover", () => {
      bg.clear();
      bg.fillStyle(bgColor, 1);
      bg.fillRect(-btnW / 2, -btnH / 2, btnW, btnH);
      bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(color).color, 1);
      bg.strokeRect(-btnW / 2, -btnH / 2, btnW, btnH);
      text.setScale(1.1);
      container.y = y - 2;
    });

    hitArea.on("pointerout", () => {
      bg.clear();
      bg.fillStyle(bgColor, 0.85);
      bg.fillRect(-btnW / 2, -btnH / 2, btnW, btnH);
      bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.9);
      bg.strokeRect(-btnW / 2, -btnH / 2, btnW, btnH);
      text.setScale(1);
      container.y = y;
    });

    hitArea.on("pointerdown", onClick);
  }

  /** Spawn slow-floating particles in the background for ambiance. */
  private spawnBackgroundParticles(tint: number): void {
    for (let i = 0; i < 20; i++) {
      const px = Math.random() * 800;
      const py = Math.random() * 600;
      const p = this.add
        .image(px, py, "particle")
        .setScale(0.5 + Math.random())
        .setAlpha(0.1 + Math.random() * 0.2)
        .setTint(tint);

      this.tweens.add({
        targets: p,
        y: py - 100 - Math.random() * 200,
        alpha: 0,
        duration: 3000 + Math.random() * 4000,
        delay: Math.random() * 2000,
        repeat: -1,
        onRepeat: () => {
          p.x = Math.random() * 800;
          p.y = 600 + Math.random() * 50;
          p.alpha = 0.1 + Math.random() * 0.2;
        },
      });
    }
  }
}
