/**
 * HtsBots Arena - Turn-Based Battle Engine
 *
 * Core battle logic for bot-vs-bot PvP combat.
 * Handles damage calculation, turn order, skill effects, and win conditions.
 */

export type BotClass = "tank" | "dps" | "healer" | "support";

export interface BotData {
  id: string;
  name: string;
  class: BotClass;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  /** Whether the bot is currently shielded (reduces damage by 50%) */
  isShielded: boolean;
  /** Whether the bot is taunting (forces enemies to target it) */
  isTaunting: boolean;
  /** Temporary attack buff multiplier (1.0 = no buff) */
  attackBuff: number;
  /** Team identifier: 0 = player, 1 = enemy */
  team: number;
}

export type ActionType = "attack" | "skill" | "defend" | "heal";

export interface BattleAction {
  type: ActionType;
  actor: BotData;
  target?: BotData;
  /** Computed damage or healing amount after the action resolves */
  value: number;
  /** Text description of the action for the battle log */
  description: string;
  /** Whether this was a critical hit */
  isCritical: boolean;
}

/** Creates a fresh BotData object with defaults. */
export function createBot(
  id: string,
  name: string,
  botClass: BotClass,
  team: number,
  overrides?: Partial<BotData>
): BotData {
  const baseStats: Record<BotClass, { hp: number; attack: number; defense: number; speed: number }> = {
    tank:    { hp: 150, attack: 12, defense: 20, speed: 5 },
    dps:     { hp: 80,  attack: 25, defense: 8,  speed: 12 },
    healer:  { hp: 100, attack: 10, defense: 12, speed: 8 },
    support: { hp: 90,  attack: 14, defense: 14, speed: 10 },
  };

  const stats = baseStats[botClass];

  return {
    id,
    name,
    class: botClass,
    hp: stats.hp,
    maxHp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    isShielded: false,
    isTaunting: false,
    attackBuff: 1.0,
    team,
    ...overrides,
  };
}

/**
 * Calculates raw damage from attacker to defender.
 * Formula: base = attacker.attack * attacker.attackBuff * (1 + random variance)
 * Reduced by defender.defense, then halved again if defender is shielded.
 * Minimum damage is 1.
 */
export function calculateDamage(
  attacker: BotData,
  defender: BotData,
  isCritical: boolean = false
): number {
  const variance = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  let baseDamage = attacker.attack * attacker.attackBuff * variance;

  if (isCritical) {
    baseDamage *= 1.8;
  }

  // Defense reduces damage: each point of defense reduces ~2% of raw damage
  const defenseReduction = 1 - (defender.defense / (defender.defense + 50));
  let finalDamage = Math.round(baseDamage * defenseReduction);

  if (defender.isShielded) {
    finalDamage = Math.round(finalDamage * 0.5);
  }

  return Math.max(1, finalDamage);
}

/**
 * Calculates healing amount for the healer class.
 * Heals for 30-40% of the healer's max HP.
 */
export function calculateHealing(healer: BotData): number {
  const base = healer.maxHp * (0.3 + Math.random() * 0.1);
  return Math.round(base);
}

/**
 * Determines turn order for all living bots across both teams.
 * Sorted by speed descending, with random tiebreaker.
 */
export function determineTurnOrder(allBots: BotData[]): BotData[] {
  return allBots
    .filter((b) => b.hp > 0)
    .sort((a, b) => {
      if (b.speed !== a.speed) return b.speed - a.speed;
      return Math.random() - 0.5;
    });
}

/** Returns true if every bot on the given team has 0 HP. */
export function isTeamDefeated(bots: BotData[], team: number): boolean {
  return bots.filter((b) => b.team === team).every((b) => b.hp <= 0);
}

/** Returns all living bots on the opposing team. */
export function getEnemies(allBots: BotData[], actor: BotData): BotData[] {
  return allBots.filter((b) => b.team !== actor.team && b.hp > 0);
}

/** Returns all living bots on the same team as the actor. */
export function getAllies(allBots: BotData[], actor: BotData): BotData[] {
  return allBots.filter((b) => b.team === actor.team && b.hp > 0);
}

/**
 * Selects the best target from enemies, respecting taunt.
 * If any enemy is taunting, that enemy must be targeted.
 * Otherwise picks the enemy with the lowest HP.
 */
export function selectTarget(enemies: BotData[]): BotData {
  const taunting = enemies.find((e) => e.isTaunting);
  if (taunting) return taunting;

  // Target lowest HP enemy
  return enemies.reduce((lowest, e) => (e.hp < lowest.hp ? e : lowest), enemies[0]);
}

/**
 * Executes a class-specific skill and returns the resulting action.
 *
 * - Tank: "Iron Wall" - gains shield + taunt for the round
 * - DPS: "Critical Strike" - guaranteed critical hit on target
 * - Healer: "Healing Pulse" - heals the lowest HP ally
 * - Support: "War Cry" - buffs all allies' attack by 30%
 */
export function executeSkill(actor: BotData, allBots: BotData[]): BattleAction {
  const enemies = getEnemies(allBots, actor);
  const allies = getAllies(allBots, actor);

  switch (actor.class) {
    case "tank": {
      actor.isShielded = true;
      actor.isTaunting = true;
      return {
        type: "skill",
        actor,
        value: 0,
        description: `${actor.name} uses Iron Wall! Shield and Taunt active!`,
        isCritical: false,
      };
    }

    case "dps": {
      const target = selectTarget(enemies);
      const damage = calculateDamage(actor, target, true);
      target.hp = Math.max(0, target.hp - damage);
      return {
        type: "skill",
        actor,
        target,
        value: damage,
        description: `${actor.name} uses Critical Strike on ${target.name} for ${damage} damage!`,
        isCritical: true,
      };
    }

    case "healer": {
      // Heal lowest HP ally
      const lowestAlly = allies.reduce(
        (lowest, a) => (a.hp / a.maxHp < lowest.hp / lowest.maxHp ? a : lowest),
        allies[0]
      );
      const healing = calculateHealing(actor);
      lowestAlly.hp = Math.min(lowestAlly.maxHp, lowestAlly.hp + healing);
      return {
        type: "skill",
        actor,
        target: lowestAlly,
        value: healing,
        description: `${actor.name} uses Healing Pulse on ${lowestAlly.name}! Heals ${healing} HP!`,
        isCritical: false,
      };
    }

    case "support": {
      // Buff all allies' attack
      allies.forEach((a) => {
        a.attackBuff = Math.min(2.0, a.attackBuff + 0.3);
      });
      return {
        type: "skill",
        actor,
        value: 0,
        description: `${actor.name} uses War Cry! All allies gain +30% attack!`,
        isCritical: false,
      };
    }

    default:
      return executeAttack(actor, allBots);
  }
}

/** Executes a basic attack against the best target on the opposing team. */
export function executeAttack(actor: BotData, allBots: BotData[]): BattleAction {
  const enemies = getEnemies(allBots, actor);
  const target = selectTarget(enemies);
  const isCritical = Math.random() < 0.15;
  const damage = calculateDamage(actor, target, isCritical);
  target.hp = Math.max(0, target.hp - damage);

  return {
    type: "attack",
    actor,
    target,
    value: damage,
    description: `${actor.name} attacks ${target.name} for ${damage} damage!${isCritical ? " CRITICAL!" : ""}`,
    isCritical,
  };
}

/** Executes a defend action: the bot gains a shield for this round. */
export function executeDefend(actor: BotData): BattleAction {
  actor.isShielded = true;
  return {
    type: "defend",
    actor,
    value: 0,
    description: `${actor.name} defends! Damage reduced by 50%.`,
    isCritical: false,
  };
}

/** Executes a direct heal on the lowest-HP ally. */
export function executeHeal(actor: BotData, allBots: BotData[]): BattleAction {
  const allies = getAllies(allBots, actor);
  const lowestAlly = allies.reduce(
    (lowest, a) => (a.hp / a.maxHp < lowest.hp / lowest.maxHp ? a : lowest),
    allies[0]
  );
  const healing = Math.round(actor.maxHp * 0.2);
  lowestAlly.hp = Math.min(lowestAlly.maxHp, lowestAlly.hp + healing);

  return {
    type: "heal",
    actor,
    target: lowestAlly,
    value: healing,
    description: `${actor.name} heals ${lowestAlly.name} for ${healing} HP!`,
    isCritical: false,
  };
}

/**
 * Chooses an AI action for an enemy bot.
 * Simple heuristic:
 * - Healers heal if any ally is below 50% HP, otherwise attack
 * - Supports buff if allies are un-buffed, otherwise attack
 * - Tanks taunt/shield if not already taunting, otherwise attack
 * - DPS use skill 40% of the time, otherwise attack
 */
export function chooseAIAction(actor: BotData, allBots: BotData[]): BattleAction {
  const allies = getAllies(allBots, actor);
  const roll = Math.random();

  switch (actor.class) {
    case "healer": {
      const anyLow = allies.some((a) => a.hp / a.maxHp < 0.5);
      if (anyLow && roll < 0.7) return executeSkill(actor, allBots);
      return executeAttack(actor, allBots);
    }
    case "support": {
      const anyUnbuffed = allies.some((a) => a.attackBuff < 1.3);
      if (anyUnbuffed && roll < 0.5) return executeSkill(actor, allBots);
      return executeAttack(actor, allBots);
    }
    case "tank": {
      if (!actor.isTaunting && roll < 0.5) return executeSkill(actor, allBots);
      if (roll < 0.3) return executeDefend(actor);
      return executeAttack(actor, allBots);
    }
    case "dps": {
      if (roll < 0.4) return executeSkill(actor, allBots);
      return executeAttack(actor, allBots);
    }
    default:
      return executeAttack(actor, allBots);
  }
}

/**
 * Clears per-round buffs at the start of each round.
 * Resets shield and taunt flags.
 */
export function clearRoundBuffs(bots: BotData[]): void {
  bots.forEach((b) => {
    b.isShielded = false;
    b.isTaunting = false;
  });
}

/** Generates the default demo team configurations. */
export function createDemoTeams(): { playerTeam: BotData[]; enemyTeam: BotData[] } {
  const playerTeam: BotData[] = [
    createBot("p1", "HTS-Tank", "tank", 0),
    createBot("p2", "HTS-Blaze", "dps", 0),
    createBot("p3", "HTS-Mend", "healer", 0),
  ];

  const enemyTeam: BotData[] = [
    createBot("e1", "ZRK-Wall", "tank", 1),
    createBot("e2", "ZRK-Fury", "dps", 1),
    createBot("e3", "ZRK-Aid", "support", 1),
  ];

  return { playerTeam, enemyTeam };
}
