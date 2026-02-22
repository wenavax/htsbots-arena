import { Injectable } from '@nestjs/common';
import { PlayerService, Player } from '../player/player.service';

export interface LeaderboardEntry {
  rank: number;
  address: string;
  username: string;
  trophies: number;
  wins: number;
  losses: number;
  winRate: number;
}

@Injectable()
export class LeaderboardService {
  constructor(private readonly playerService: PlayerService) {}

  /**
   * Get the top players sorted by trophies in descending order.
   * @param limit Maximum number of entries to return (default 50)
   */
  getLeaderboard(limit: number = 50): LeaderboardEntry[] {
    const players = this.playerService.getAllPlayers();

    const sorted = players.sort((a, b) => {
      // Primary sort: trophies descending
      if (b.trophies !== a.trophies) {
        return b.trophies - a.trophies;
      }
      // Tiebreaker: wins descending
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      // Tiebreaker: fewer losses
      return a.losses - b.losses;
    });

    return sorted.slice(0, limit).map((player, index) => {
      const totalGames = player.wins + player.losses;
      const winRate = totalGames > 0
        ? Math.round((player.wins / totalGames) * 10000) / 100
        : 0;

      return {
        rank: index + 1,
        address: player.address,
        username: player.username,
        trophies: player.trophies,
        wins: player.wins,
        losses: player.losses,
        winRate,
      };
    });
  }

  /**
   * Get a specific player's rank on the leaderboard.
   */
  getPlayerRank(address: string): number | null {
    const leaderboard = this.getLeaderboard(Number.MAX_SAFE_INTEGER);
    const entry = leaderboard.find(
      (e) => e.address === address.toLowerCase(),
    );
    return entry ? entry.rank : null;
  }
}
