/**
 * HtsBots Arena - Main Battle Scene
 *
 * Two teams of 3 bots each. Turn-based combat with animated attacks,
 * HP bars, damage popups, battle log, and action menu.
 */
import Phaser from "phaser";
import {
  BotData,
  BotClass,
  ActionType,
  BattleAction,
  createDemoTeams,
  determineTurnOrder,
  isTeamDefeated,
  getEnemies,
  executeAttack,
  executeSkill,
  executeDefend,
  executeHeal,
  chooseAIAction,
  clearRoundBuffs,
  calculateDamage,
  selectTarget,
} from "../BattleEngine";

/** Visual representation of a bot on the battlefield. */
interface BotSprite {
  data: BotData;
  container: Phaser.GameObjects.Container;
  sprite: Phaser.GameObjects.Image;
  hpBarBg: Phaser.GameObjects.Image;
  hpBarFill: Phaser.GameObjects.Image;
  nameText: Phaser.GameObjects.Text;
  hpText: Phaser.GameObjects.Text;
  /** Pulsing glow sprite shown when it is this bot's turn */
  glowCircle: Phaser.GameObjects.Graphics;
  /** Starting x,y for reset after attack animation */
  homeX: number;
  homeY: number;
}

const FONT_PIXEL = '"Press Start 2P", monospace';

// Layout constants
const TEAM_LEFT_X = 160;
const TEAM_RIGHT_X = 640;
const TEAM_Y_START = 140;
const TEAM_Y_GAP = 130;
const BOT_SCALE = 2.5;

export class BattleScene extends Phaser.Scene {
  private botSprites: BotSprite[] = [];
  private allBots: BotData[] = [];
  private turnOrder: BotData[] = [];
  private currentTurnIndex: number = 0;
  private isAnimating: boolean = false;
  private round: number = 1;

  // UI elements
  private actionButtons: Phaser.GameObjects.Container[] = [];
  private actionMenu!: Phaser.GameObjects.Container;
  private battleLogText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private turnIndicatorText!: Phaser.GameObjects.Text;
  private battleLogLines: string[] = [];

  // Target selection
  private isSelectingTarget: boolean = false;
  private pendingAction: ActionType | null = null;
  private targetHighlights: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: "BattleScene" });
  }

  create(): void {
    this.isAnimating = false;
    this.botSprites = [];
    this.allBots = [];
    this.battleLogLines = [];
    this.targetHighlights = [];
    this.isSelectingTarget = false;
    this.pendingAction = null;
    this.round = 1;

    // -- Arena background --
    this.drawArenaBackground();

    // -- Create teams --
    const { playerTeam, enemyTeam } = createDemoTeams();
    this.allBots = [...playerTeam, ...enemyTeam];

    // -- Place bot sprites --
    playerTeam.forEach((bot, i) => {
      this.createBotSprite(bot, TEAM_LEFT_X, TEAM_Y_START + i * TEAM_Y_GAP, false);
    });
    enemyTeam.forEach((bot, i) => {
      this.createBotSprite(bot, TEAM_RIGHT_X, TEAM_Y_START + i * TEAM_Y_GAP, true);
    });

    // -- Team labels --
    this.add
      .text(TEAM_LEFT_X, 80, "YOUR TEAM", {
        fontFamily: FONT_PIXEL,
        fontSize: "10px",
        color: "#39FF14",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#39FF14", 4);

    this.add
      .text(TEAM_RIGHT_X, 80, "ENEMY TEAM", {
        fontFamily: FONT_PIXEL,
        fontSize: "10px",
        color: "#FF4444",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#FF4444", 4);

    // -- Divider line --
    const divider = this.add.graphics();
    divider.lineStyle(2, 0x1e1e2e, 0.6);
    divider.lineBetween(400, 90, 400, 470);
    divider.lineStyle(1, 0x39ff14, 0.15);
    divider.lineBetween(400, 90, 400, 470);

    // -- Round indicator --
    this.roundText = this.add
      .text(400, 20, `ROUND ${this.round}`, {
        fontFamily: FONT_PIXEL,
        fontSize: "12px",
        color: "#00FFFF",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, "#00FFFF", 6);

    // -- Turn indicator --
    this.turnIndicatorText = this.add
      .text(400, 42, "", {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: "#DFFF00",
      })
      .setOrigin(0.5);

    // -- VS decoration --
    this.add
      .text(400, 64, "- VS -", {
        fontFamily: FONT_PIXEL,
        fontSize: "8px",
        color: "#444466",
      })
      .setOrigin(0.5);

    // -- Action menu --
    this.createActionMenu();

    // -- Battle log --
    this.createBattleLog();

    // -- Start battle --
    this.addBattleLog("Battle begins!");
    this.startNewRound();

    // Entry animations
    this.botSprites.forEach((bs, i) => {
      const startX = bs.data.team === 0 ? -100 : 900;
      bs.container.x = startX;
      this.tweens.add({
        targets: bs.container,
        x: bs.homeX,
        duration: 500,
        delay: i * 80,
        ease: "Back.easeOut",
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Arena Background                                                   */
  /* ------------------------------------------------------------------ */

  private drawArenaBackground(): void {
    // Tiled floor
    for (let x = 0; x < 800; x += 64) {
      for (let y = 80; y < 480; y += 64) {
        this.add.image(x, y, "floor_tile").setOrigin(0).setAlpha(0.6);
      }
    }

    // Top and bottom border bars
    const borderGfx = this.add.graphics();
    borderGfx.fillStyle(0x0a0a0f);
    borderGfx.fillRect(0, 0, 800, 80);
    borderGfx.fillRect(0, 470, 800, 130);

    // Border accents
    borderGfx.lineStyle(2, 0x39ff14, 0.25);
    borderGfx.lineBetween(0, 80, 800, 80);
    borderGfx.lineStyle(2, 0x1e1e2e, 0.5);
    borderGfx.lineBetween(0, 470, 800, 470);

    // Subtle corner marks
    borderGfx.lineStyle(1, 0x39ff14, 0.2);
    // Top-left
    borderGfx.lineBetween(10, 85, 40, 85);
    borderGfx.lineBetween(10, 85, 10, 105);
    // Top-right
    borderGfx.lineBetween(760, 85, 790, 85);
    borderGfx.lineBetween(790, 85, 790, 105);
    // Bottom-left
    borderGfx.lineBetween(10, 465, 40, 465);
    borderGfx.lineBetween(10, 445, 10, 465);
    // Bottom-right
    borderGfx.lineBetween(760, 465, 790, 465);
    borderGfx.lineBetween(790, 445, 790, 465);
  }

  /* ------------------------------------------------------------------ */
  /*  Bot Sprite Creation                                                */
  /* ------------------------------------------------------------------ */

  private getTextureKey(botClass: BotClass): string {
    return `bot_${botClass}`;
  }

  private createBotSprite(
    bot: BotData,
    x: number,
    y: number,
    flipX: boolean
  ): void {
    const container = this.add.container(x, y);

    // Glow circle (hidden by default)
    const glowCircle = this.add.graphics();
    glowCircle.fillStyle(0x39ff14, 0.12);
    glowCircle.fillCircle(0, 10, 38);
    glowCircle.setVisible(false);
    container.add(glowCircle);

    // Bot sprite
    const sprite = this.add
      .image(0, 0, this.getTextureKey(bot.class))
      .setScale(BOT_SCALE)
      .setFlipX(flipX);
    container.add(sprite);

    // Name label
    const nameText = this.add
      .text(0, -50, bot.name, {
        fontFamily: FONT_PIXEL,
        fontSize: "7px",
        color: bot.team === 0 ? "#39FF14" : "#FF6666",
      })
      .setOrigin(0.5);
    container.add(nameText);

    // Class label
    const classText = this.add
      .text(0, -40, `[${bot.class.toUpperCase()}]`, {
        fontFamily: FONT_PIXEL,
        fontSize: "6px",
        color: "#666688",
      })
      .setOrigin(0.5);
    container.add(classText);

    // HP bar background
    const hpBarBg = this.add.image(0, 42, "hp_bar_bg").setScale(1.8, 1.5);
    container.add(hpBarBg);

    // HP bar fill
    const hpBarFill = this.add.image(0, 42, "hp_bar_fill").setScale(1.8, 1.5);
    container.add(hpBarFill);

    // HP text
    const hpText = this.add
      .text(0, 54, `${bot.hp}/${bot.maxHp}`, {
        fontFamily: FONT_PIXEL,
        fontSize: "6px",
        color: "#AAAAAA",
      })
      .setOrigin(0.5);
    container.add(hpText);

    const botSprite: BotSprite = {
      data: bot,
      container,
      sprite,
      hpBarBg,
      hpBarFill,
      nameText,
      hpText,
      glowCircle,
      homeX: x,
      homeY: y,
    };

    this.botSprites.push(botSprite);

    // Make bot interactive (for targeting)
    sprite.setInteractive({ useHandCursor: true });
    sprite.on("pointerdown", () => this.onBotClicked(botSprite));
    sprite.on("pointerover", () => {
      if (this.isSelectingTarget && bot.team === 1 && bot.hp > 0) {
        sprite.setTint(0xffff00);
      }
    });
    sprite.on("pointerout", () => {
      if (bot.hp > 0) sprite.clearTint();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  HP Bar Update                                                      */
  /* ------------------------------------------------------------------ */

  private updateHpBar(bs: BotSprite): void {
    const ratio = Math.max(0, bs.data.hp / bs.data.maxHp);

    // Swap fill texture based on HP ratio
    if (ratio > 0.5) {
      bs.hpBarFill.setTexture("hp_bar_fill");
    } else if (ratio > 0.25) {
      bs.hpBarFill.setTexture("hp_bar_yellow");
    } else {
      bs.hpBarFill.setTexture("hp_bar_red");
    }

    // Animate the scale-X to represent remaining HP
    this.tweens.add({
      targets: bs.hpBarFill,
      scaleX: 1.8 * ratio,
      duration: 300,
      ease: "Quad.easeOut",
    });

    // Update text
    bs.hpText.setText(`${Math.max(0, bs.data.hp)}/${bs.data.maxHp}`);
  }

  /* ------------------------------------------------------------------ */
  /*  Action Menu                                                        */
  /* ------------------------------------------------------------------ */

  private createActionMenu(): void {
    this.actionMenu = this.add.container(400, 530);

    const actions: { label: string; type: ActionType; color: string; bgColor: number }[] = [
      { label: "ATTACK", type: "attack", color: "#FF4444", bgColor: 0x441111 },
      { label: "SKILL", type: "skill", color: "#FFAA00", bgColor: 0x442200 },
      { label: "DEFEND", type: "defend", color: "#3388FF", bgColor: 0x112244 },
      { label: "HEAL", type: "heal", color: "#39FF14", bgColor: 0x114411 },
    ];

    const btnWidth = 120;
    const btnHeight = 32;
    const gap = 12;
    const totalWidth = actions.length * btnWidth + (actions.length - 1) * gap;
    const startX = -totalWidth / 2 + btnWidth / 2;

    actions.forEach((action, i) => {
      const x = startX + i * (btnWidth + gap);
      const btnContainer = this.add.container(x, 0);

      // Button background
      const bg = this.add.graphics();
      bg.fillStyle(action.bgColor, 0.85);
      bg.fillRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
      bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(action.color).color, 0.9);
      bg.strokeRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
      btnContainer.add(bg);

      // Button text
      const text = this.add
        .text(0, 0, action.label, {
          fontFamily: FONT_PIXEL,
          fontSize: "8px",
          color: action.color,
        })
        .setOrigin(0.5);
      btnContainer.add(text);

      // Make interactive
      const hitArea = this.add
        .zone(0, 0, btnWidth, btnHeight)
        .setInteractive({ useHandCursor: true });
      btnContainer.add(hitArea);

      hitArea.on("pointerover", () => {
        bg.clear();
        bg.fillStyle(action.bgColor, 1);
        bg.fillRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
        bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(action.color).color, 1);
        bg.strokeRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
        text.setScale(1.1);
      });

      hitArea.on("pointerout", () => {
        bg.clear();
        bg.fillStyle(action.bgColor, 0.85);
        bg.fillRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
        bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(action.color).color, 0.9);
        bg.strokeRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);
        text.setScale(1);
      });

      hitArea.on("pointerdown", () => {
        if (!this.isAnimating) this.onActionSelected(action.type);
      });

      this.actionMenu.add(btnContainer);
      this.actionButtons.push(btnContainer);
    });

    this.actionMenu.setVisible(false);
  }

  /* ------------------------------------------------------------------ */
  /*  Battle Log                                                         */
  /* ------------------------------------------------------------------ */

  private createBattleLog(): void {
    // Background panel
    const logBg = this.add.graphics();
    logBg.fillStyle(0x080810, 0.9);
    logBg.fillRect(10, 478, 780, 40);
    logBg.lineStyle(1, 0x1e1e2e, 0.5);
    logBg.strokeRect(10, 478, 780, 40);

    this.battleLogText = this.add.text(20, 484, "", {
      fontFamily: FONT_PIXEL,
      fontSize: "7px",
      color: "#888899",
      wordWrap: { width: 760 },
      lineSpacing: 4,
    });
  }

  private addBattleLog(message: string): void {
    this.battleLogLines.push(message);
    // Keep last 3 lines
    if (this.battleLogLines.length > 3) {
      this.battleLogLines.shift();
    }
    this.battleLogText.setText(this.battleLogLines.join("\n"));
  }

  /* ------------------------------------------------------------------ */
  /*  Turn Management                                                    */
  /* ------------------------------------------------------------------ */

  private startNewRound(): void {
    clearRoundBuffs(this.allBots);
    this.turnOrder = determineTurnOrder(this.allBots);
    this.currentTurnIndex = 0;
    this.roundText.setText(`ROUND ${this.round}`);

    // Flash the round text
    this.tweens.add({
      targets: this.roundText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 200,
      yoyo: true,
      ease: "Quad.easeOut",
    });

    this.processTurn();
  }

  private processTurn(): void {
    // Skip dead bots
    while (
      this.currentTurnIndex < this.turnOrder.length &&
      this.turnOrder[this.currentTurnIndex].hp <= 0
    ) {
      this.currentTurnIndex++;
    }

    if (this.currentTurnIndex >= this.turnOrder.length) {
      // Round over
      this.round++;
      this.startNewRound();
      return;
    }

    const currentBot = this.turnOrder[this.currentTurnIndex];

    // Highlight current bot
    this.clearAllGlows();
    const bs = this.getBotSprite(currentBot);
    if (bs) {
      bs.glowCircle.setVisible(true);
      this.tweens.add({
        targets: bs.glowCircle,
        alpha: { from: 0.12, to: 0.3 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
      // Slight bounce
      this.tweens.add({
        targets: bs.sprite,
        y: -4,
        duration: 300,
        yoyo: true,
        repeat: -1,
      });
    }

    this.turnIndicatorText.setText(`${currentBot.name}'s Turn`);

    if (currentBot.team === 0) {
      // Player turn: show action menu
      this.actionMenu.setVisible(true);
    } else {
      // Enemy turn: AI decides
      this.actionMenu.setVisible(false);
      this.time.delayedCall(600, () => {
        const action = chooseAIAction(currentBot, this.allBots);
        this.animateAction(action);
      });
    }
  }

  private advanceTurn(): void {
    this.currentTurnIndex++;
    // Check win/lose
    if (isTeamDefeated(this.allBots, 0)) {
      this.endBattle(false);
      return;
    }
    if (isTeamDefeated(this.allBots, 1)) {
      this.endBattle(true);
      return;
    }
    this.processTurn();
  }

  /* ------------------------------------------------------------------ */
  /*  Action Handling                                                     */
  /* ------------------------------------------------------------------ */

  private onActionSelected(actionType: ActionType): void {
    if (this.isAnimating) return;

    const currentBot = this.turnOrder[this.currentTurnIndex];
    if (!currentBot || currentBot.team !== 0) return;

    if (actionType === "attack") {
      // Enter target selection mode
      this.isSelectingTarget = true;
      this.pendingAction = "attack";
      this.showTargetSelection();
      return;
    }

    // Non-targeted actions execute immediately
    this.actionMenu.setVisible(false);
    let action: BattleAction;

    switch (actionType) {
      case "skill":
        action = executeSkill(currentBot, this.allBots);
        break;
      case "defend":
        action = executeDefend(currentBot);
        break;
      case "heal":
        action = executeHeal(currentBot, this.allBots);
        break;
      default:
        return;
    }

    this.animateAction(action);
  }

  private showTargetSelection(): void {
    this.addBattleLog("Select a target...");
    // Highlight enemy bots
    this.botSprites
      .filter((bs) => bs.data.team === 1 && bs.data.hp > 0)
      .forEach((bs) => {
        const highlight = this.add.graphics();
        highlight.lineStyle(2, 0xffff00, 0.8);
        highlight.strokeCircle(bs.homeX, bs.homeY + 10, 36);
        this.tweens.add({
          targets: highlight,
          alpha: { from: 0.8, to: 0.3 },
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
        this.targetHighlights.push(highlight);
      });
  }

  private clearTargetSelection(): void {
    this.targetHighlights.forEach((h) => h.destroy());
    this.targetHighlights = [];
    this.isSelectingTarget = false;
    this.pendingAction = null;
  }

  private onBotClicked(bs: BotSprite): void {
    if (!this.isSelectingTarget || this.isAnimating) return;
    if (bs.data.team !== 1 || bs.data.hp <= 0) return;

    const currentBot = this.turnOrder[this.currentTurnIndex];
    if (!currentBot) return;

    this.clearTargetSelection();
    this.actionMenu.setVisible(false);

    // Calculate and apply damage directly to the target
    const isCritical = Math.random() < 0.15;
    const damage = calculateDamage(currentBot, bs.data, isCritical);
    bs.data.hp = Math.max(0, bs.data.hp - damage);

    const action: BattleAction = {
      type: "attack",
      actor: currentBot,
      target: bs.data,
      value: damage,
      description: `${currentBot.name} attacks ${bs.data.name} for ${damage} damage!${isCritical ? " CRITICAL!" : ""}`,
      isCritical,
    };

    this.animateAction(action);
  }

  /* ------------------------------------------------------------------ */
  /*  Action Animation                                                    */
  /* ------------------------------------------------------------------ */

  private animateAction(action: BattleAction): void {
    this.isAnimating = true;
    this.clearAllGlows();
    this.addBattleLog(action.description);

    const actorSprite = this.getBotSprite(action.actor);
    if (!actorSprite) {
      this.isAnimating = false;
      this.advanceTurn();
      return;
    }

    switch (action.type) {
      case "attack":
      case "skill":
        if (action.target && action.value > 0) {
          this.animateAttack(actorSprite, action);
        } else {
          // Buff / self-targeted skill
          this.animateBuff(actorSprite, action);
        }
        break;
      case "defend":
        this.animateDefend(actorSprite, action);
        break;
      case "heal":
        this.animateHealEffect(actorSprite, action);
        break;
      default:
        this.isAnimating = false;
        this.advanceTurn();
    }
  }

  /** Move the attacker toward the target, flash, show damage. */
  private animateAttack(actorSprite: BotSprite, action: BattleAction): void {
    const targetSprite = action.target
      ? this.getBotSprite(action.target)
      : null;
    if (!targetSprite) {
      this.isAnimating = false;
      this.advanceTurn();
      return;
    }

    const targetX = targetSprite.homeX;
    const targetY = targetSprite.homeY;
    const moveToX =
      actorSprite.data.team === 0 ? targetX - 60 : targetX + 60;

    // Step 1: Move attacker toward target
    this.tweens.add({
      targets: actorSprite.container,
      x: moveToX,
      y: targetY,
      duration: 250,
      ease: "Quad.easeIn",
      onComplete: () => {
        // Step 2: Impact effects
        this.showImpactEffects(targetSprite, action);

        // Step 3: Camera shake
        this.cameras.main.shake(
          action.isCritical ? 300 : 150,
          action.isCritical ? 0.015 : 0.008
        );

        // Flash the target red
        targetSprite.sprite.setTint(0xff0000);
        this.time.delayedCall(150, () => {
          if (targetSprite.data.hp > 0) {
            targetSprite.sprite.clearTint();
          }
        });

        // Step 4: Move attacker back
        this.tweens.add({
          targets: actorSprite.container,
          x: actorSprite.homeX,
          y: actorSprite.homeY,
          duration: 300,
          delay: 200,
          ease: "Quad.easeOut",
          onComplete: () => {
            // Update HP bar
            this.updateHpBar(targetSprite);

            // Check if target died
            if (targetSprite.data.hp <= 0) {
              this.animateDeath(targetSprite);
            }

            this.time.delayedCall(300, () => {
              this.isAnimating = false;
              this.advanceTurn();
            });
          },
        });
      },
    });
  }

  /** Show impact particles and damage number at the target location. */
  private showImpactEffects(targetSprite: BotSprite, action: BattleAction): void {
    const tx = targetSprite.homeX;
    const ty = targetSprite.homeY;

    // Attack flash effect
    const fx = this.add.image(tx, ty, "attack_fx").setScale(3).setAlpha(0.9);
    this.tweens.add({
      targets: fx,
      scaleX: 5,
      scaleY: 5,
      alpha: 0,
      angle: 45,
      duration: 300,
      ease: "Quad.easeOut",
      onComplete: () => fx.destroy(),
    });

    // Damage number popup
    const dmgColor = action.isCritical ? "#FFFF00" : "#FF4444";
    const dmgSize = action.isCritical ? "14px" : "11px";
    const prefix = action.isCritical ? "CRIT! " : "";
    const dmgText = this.add
      .text(tx, ty - 20, `${prefix}-${action.value}`, {
        fontFamily: FONT_PIXEL,
        fontSize: dmgSize,
        color: dmgColor,
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: dmgText,
      y: ty - 80,
      alpha: 0,
      duration: 1000,
      ease: "Quad.easeOut",
      onComplete: () => dmgText.destroy(),
    });

    // Spawn particles
    for (let i = 0; i < 8; i++) {
      const p = this.add
        .image(tx, ty, "particle")
        .setScale(1.5)
        .setTint(action.isCritical ? 0xffff00 : 0xff4444);
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 30 + Math.random() * 20;
      this.tweens.add({
        targets: p,
        x: tx + Math.cos(angle) * dist,
        y: ty + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 400,
        ease: "Quad.easeOut",
        onComplete: () => p.destroy(),
      });
    }
  }

  /** Animate a bot dying: fade out, collapse. */
  private animateDeath(bs: BotSprite): void {
    this.addBattleLog(`${bs.data.name} has been destroyed!`);

    // Flash white
    bs.sprite.setTint(0xffffff);

    this.tweens.add({
      targets: bs.container,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.1,
      y: bs.homeY + 30,
      duration: 600,
      ease: "Quad.easeIn",
    });

    // Explosion particles
    for (let i = 0; i < 12; i++) {
      const p = this.add
        .image(bs.homeX, bs.homeY, "particle")
        .setScale(2)
        .setTint(0xff6600);
      const angle = (Math.PI * 2 * i) / 12;
      const dist = 40 + Math.random() * 30;
      this.tweens.add({
        targets: p,
        x: bs.homeX + Math.cos(angle) * dist,
        y: bs.homeY + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.3,
        duration: 600,
        ease: "Quad.easeOut",
        onComplete: () => p.destroy(),
      });
    }
  }

  /** Buff animation (glow, text popup). */
  private animateBuff(actorSprite: BotSprite, action: BattleAction): void {
    // Show buff effect at actor's position
    const fx = this.add.graphics();
    fx.fillStyle(0xffaa00, 0.3);
    fx.fillCircle(actorSprite.homeX, actorSprite.homeY, 30);
    this.tweens.add({
      targets: fx,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 500,
      onComplete: () => fx.destroy(),
    });

    // Status text popup
    const statusText = this.add
      .text(actorSprite.homeX, actorSprite.homeY - 30, action.description.split("!")[0] + "!", {
        fontFamily: FONT_PIXEL,
        fontSize: "7px",
        color: "#FFAA00",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: statusText,
      y: actorSprite.homeY - 70,
      alpha: 0,
      duration: 1200,
      onComplete: () => {
        statusText.destroy();
        this.isAnimating = false;
        this.advanceTurn();
      },
    });

    // If a skill healed a target, update their HP bar
    if (action.target) {
      const targetBs = this.getBotSprite(action.target);
      if (targetBs) {
        this.updateHpBar(targetBs);
        // Heal particles on the target
        if (action.type === "skill" && action.actor.class === "healer") {
          this.showHealParticles(targetBs);
        }
      }
    }

    // If it buffed allies (support), flash all ally sprites
    if (action.actor.class === "support") {
      this.botSprites
        .filter((bs) => bs.data.team === action.actor.team && bs.data.hp > 0)
        .forEach((bs) => {
          bs.sprite.setTint(0xffcc00);
          this.time.delayedCall(400, () => bs.sprite.clearTint());
        });
    }
  }

  /** Defend animation (shield icon appears). */
  private animateDefend(actorSprite: BotSprite, action: BattleAction): void {
    const shieldImg = this.add
      .image(actorSprite.homeX, actorSprite.homeY, "shield_fx")
      .setScale(3)
      .setAlpha(0);

    this.tweens.add({
      targets: shieldImg,
      alpha: 0.8,
      scale: 4,
      duration: 300,
      yoyo: true,
      hold: 400,
      onComplete: () => {
        shieldImg.destroy();
        this.isAnimating = false;
        this.advanceTurn();
      },
    });

    // Blue tint on the bot
    actorSprite.sprite.setTint(0x3388ff);
    this.time.delayedCall(800, () => {
      if (actorSprite.data.hp > 0) actorSprite.sprite.clearTint();
    });
  }

  /** Heal action animation. */
  private animateHealEffect(actorSprite: BotSprite, action: BattleAction): void {
    const targetSprite = action.target
      ? this.getBotSprite(action.target)
      : actorSprite;
    if (!targetSprite) {
      this.isAnimating = false;
      this.advanceTurn();
      return;
    }

    this.showHealParticles(targetSprite);

    // Heal number popup
    const healText = this.add
      .text(targetSprite.homeX, targetSprite.homeY - 20, `+${action.value}`, {
        fontFamily: FONT_PIXEL,
        fontSize: "11px",
        color: "#39FF14",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: healText,
      y: targetSprite.homeY - 70,
      alpha: 0,
      duration: 1000,
      ease: "Quad.easeOut",
      onComplete: () => healText.destroy(),
    });

    // Update HP bar
    this.updateHpBar(targetSprite);

    // Green flash
    targetSprite.sprite.setTint(0x39ff14);
    this.time.delayedCall(400, () => {
      if (targetSprite.data.hp > 0) targetSprite.sprite.clearTint();
    });

    this.time.delayedCall(800, () => {
      this.isAnimating = false;
      this.advanceTurn();
    });
  }

  /** Green cross particles rising upward on the target. */
  private showHealParticles(bs: BotSprite): void {
    const tx = bs.homeX;
    const ty = bs.homeY;

    // Heal cross effect
    const healFx = this.add
      .image(tx, ty, "heal_fx")
      .setScale(2.5)
      .setAlpha(0.8);
    this.tweens.add({
      targets: healFx,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      y: ty - 30,
      duration: 600,
      onComplete: () => healFx.destroy(),
    });

    // Rising green particles
    for (let i = 0; i < 6; i++) {
      const p = this.add
        .image(tx + (Math.random() - 0.5) * 30, ty + 10, "particle")
        .setScale(1)
        .setTint(0x39ff14);
      this.tweens.add({
        targets: p,
        y: ty - 40 - Math.random() * 30,
        alpha: 0,
        duration: 600 + Math.random() * 300,
        delay: i * 50,
        onComplete: () => p.destroy(),
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                             */
  /* ------------------------------------------------------------------ */

  private getBotSprite(bot: BotData): BotSprite | undefined {
    return this.botSprites.find((bs) => bs.data.id === bot.id);
  }

  private clearAllGlows(): void {
    this.botSprites.forEach((bs) => {
      bs.glowCircle.setVisible(false);
      this.tweens.killTweensOf(bs.glowCircle);
      this.tweens.killTweensOf(bs.sprite);
      bs.sprite.y = 0; // Reset bounce
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Battle End                                                          */
  /* ------------------------------------------------------------------ */

  private endBattle(playerWon: boolean): void {
    this.actionMenu.setVisible(false);
    this.clearAllGlows();
    this.clearTargetSelection();

    // Overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, 800, 600);
    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 500,
    });

    // Result text
    const resultText = playerWon ? "VICTORY!" : "DEFEAT";
    const resultColor = playerWon ? "#39FF14" : "#FF4444";
    const shadowColor = playerWon ? "#39FF14" : "#FF4444";

    const resultLabel = this.add
      .text(400, 250, resultText, {
        fontFamily: FONT_PIXEL,
        fontSize: "32px",
        color: resultColor,
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setShadow(0, 0, shadowColor, 12);

    this.tweens.add({
      targets: resultLabel,
      alpha: 1,
      scaleX: { from: 3, to: 1 },
      scaleY: { from: 3, to: 1 },
      duration: 600,
      ease: "Back.easeOut",
    });

    // Sub-text
    const subText = this.add
      .text(400, 310, playerWon ? "All enemy bots destroyed!" : "Your team was eliminated...", {
        fontFamily: FONT_PIXEL,
        fontSize: "9px",
        color: "#888899",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: subText,
      alpha: 1,
      delay: 600,
      duration: 400,
    });

    // Continue button
    this.time.delayedCall(1500, () => {
      const continueText = this.add
        .text(400, 380, "[ CONTINUE ]", {
          fontFamily: FONT_PIXEL,
          fontSize: "10px",
          color: "#00FFFF",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      continueText.setShadow(0, 0, "#00FFFF", 6);

      this.tweens.add({
        targets: continueText,
        alpha: { from: 0.5, to: 1 },
        duration: 600,
        yoyo: true,
        repeat: -1,
      });

      continueText.on("pointerdown", () => {
        this.scene.start("VictoryScene", { playerWon });
      });
    });
  }
}
