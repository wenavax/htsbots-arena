// ============================================
// Bot Types
// ============================================

export enum BotClass {
  TANK = "TANK",
  DPS = "DPS",
  HEALER = "HEALER",
  SUPPORT = "SUPPORT",
}

export enum BotRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface BotStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  energy: number;
}

export interface Bot {
  id: string;
  tokenId: number;
  name: string;
  class: BotClass;
  rarity: BotRarity;
  level: number;
  experience: number;
  stats: BotStats;
  skills: string[];
  imageUri: string;
  owner: string; // wallet address
}

// ============================================
// Player Types
// ============================================

export interface Player {
  id: string;
  walletAddress: string;
  username: string;
  avatar: string;
  rank: number;
  trophies: number;
  wins: number;
  losses: number;
  teamSlots: number;
  createdAt: Date;
}

export interface Team {
  id: string;
  playerId: string;
  name: string;
  bots: Bot[];
  isActive: boolean;
}

// ============================================
// Battle Types
// ============================================

export enum BattleStatus {
  MATCHMAKING = "MATCHMAKING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum BattleActionType {
  ATTACK = "ATTACK",
  SKILL = "SKILL",
  DEFEND = "DEFEND",
  HEAL = "HEAL",
}

export interface BattleAction {
  turn: number;
  actorBotId: string;
  targetBotId: string;
  actionType: BattleActionType;
  damage: number;
  healAmount: number;
  skillId?: string;
}

export interface Battle {
  id: string;
  player1Id: string;
  player2Id: string;
  team1: Team;
  team2: Team;
  status: BattleStatus;
  actions: BattleAction[];
  winnerId?: string;
  rewardAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

// ============================================
// Marketplace Types
// ============================================

export enum ListingStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  CANCELLED = "CANCELLED",
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  bot: Bot;
  priceInHtsb: number;
  priceInEth: number;
  status: ListingStatus;
  createdAt: Date;
  soldAt?: Date;
  buyerId?: string;
}

// ============================================
// Tournament Types
// ============================================

export enum TournamentStatus {
  REGISTRATION = "REGISTRATION",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  currentPlayers: number;
  status: TournamentStatus;
  startDate: Date;
  endDate?: Date;
  winnerId?: string;
}

// ============================================
// Leaderboard Types
// ============================================

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  trophies: number;
  wins: number;
  winRate: number;
}
