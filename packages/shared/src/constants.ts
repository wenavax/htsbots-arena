import { BotClass, BotRarity, type BotStats } from "./types";

// ============================================
// Game Balance Constants
// ============================================

export const MAX_TEAM_SIZE = 5;
export const MIN_TEAM_SIZE = 3;
export const MAX_BOT_LEVEL = 50;
export const XP_PER_LEVEL = 100;

// Base stats per class (level 1)
export const BASE_STATS: Record<BotClass, BotStats> = {
  [BotClass.TANK]: { hp: 150, attack: 20, defense: 40, speed: 10, energy: 80 },
  [BotClass.DPS]: { hp: 80, attack: 50, defense: 15, speed: 30, energy: 100 },
  [BotClass.HEALER]: { hp: 90, attack: 15, defense: 20, speed: 20, energy: 120 },
  [BotClass.SUPPORT]: { hp: 100, attack: 25, defense: 25, speed: 25, energy: 110 },
};

// Stat multipliers per rarity
export const RARITY_MULTIPLIERS: Record<BotRarity, number> = {
  [BotRarity.COMMON]: 1.0,
  [BotRarity.UNCOMMON]: 1.15,
  [BotRarity.RARE]: 1.35,
  [BotRarity.EPIC]: 1.6,
  [BotRarity.LEGENDARY]: 2.0,
};

// Level-up stat growth (percentage per level)
export const LEVEL_STAT_GROWTH = 0.05;

// ============================================
// Economy Constants
// ============================================

export const HTSB_TOKEN_SYMBOL = "HTSB";
export const HTSB_TOKEN_DECIMALS = 18;

export const BATTLE_REWARD_WIN = 10;
export const BATTLE_REWARD_LOSS = 2;

export const MARKETPLACE_FEE_PERCENT = 5;

export const MINT_PRICE_ETH = 0.01;

// ============================================
// Blockchain Constants
// ============================================

export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_RPC_URL = "https://mainnet.base.org";
export const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org";

// ============================================
// Battle Constants
// ============================================

export const MAX_TURNS_PER_BATTLE = 30;
export const TURN_TIME_LIMIT_SECONDS = 30;

// ============================================
// Tournament Constants
// ============================================

export const MIN_TOURNAMENT_PLAYERS = 8;
export const MAX_TOURNAMENT_PLAYERS = 64;
export const TOURNAMENT_PRIZE_DISTRIBUTION = [0.5, 0.25, 0.15, 0.1]; // 1st, 2nd, 3rd, 4th
