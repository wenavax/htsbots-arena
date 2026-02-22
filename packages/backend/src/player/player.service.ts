import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export interface Player {
  address: string;
  username: string;
  trophies: number;
  wins: number;
  losses: number;
  registeredAt: number;
}

@Injectable()
export class PlayerService {
  /** Maps wallet address (lowercase) -> Player profile */
  private readonly players = new Map<string, Player>();

  /**
   * Register a new player with a wallet address and username.
   */
  register(address: string, username: string): Player {
    const normalizedAddress = address.toLowerCase();

    if (this.players.has(normalizedAddress)) {
      throw new ConflictException(
        'A player with this address is already registered.',
      );
    }

    // Check for duplicate username
    for (const player of this.players.values()) {
      if (player.username.toLowerCase() === username.toLowerCase()) {
        throw new ConflictException('This username is already taken.');
      }
    }

    const player: Player = {
      address: normalizedAddress,
      username,
      trophies: 0,
      wins: 0,
      losses: 0,
      registeredAt: Date.now(),
    };

    this.players.set(normalizedAddress, player);
    return player;
  }

  /**
   * Retrieve a player by wallet address.
   */
  getPlayer(address: string): Player | undefined {
    return this.players.get(address.toLowerCase());
  }

  /**
   * Retrieve a player by wallet address. Throws if not found.
   */
  getPlayerOrFail(address: string): Player {
    const player = this.getPlayer(address);
    if (!player) {
      throw new NotFoundException(
        `Player with address ${address} not found.`,
      );
    }
    return player;
  }

  /**
   * Get all registered players.
   */
  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  /**
   * Update a player's trophy count by a delta (can be negative).
   * Trophies cannot go below 0.
   */
  updateTrophies(address: string, delta: number): Player {
    const player = this.getPlayerOrFail(address);
    player.trophies = Math.max(0, player.trophies + delta);
    return player;
  }

  /**
   * Record a win for the player.
   */
  recordWin(address: string): Player {
    const player = this.getPlayerOrFail(address);
    player.wins++;
    return player;
  }

  /**
   * Record a loss for the player.
   */
  recordLoss(address: string): Player {
    const player = this.getPlayerOrFail(address);
    player.losses++;
    return player;
  }
}
