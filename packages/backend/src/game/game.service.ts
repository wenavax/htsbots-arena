import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PlayerService } from '../player/player.service';

export interface QueueEntry {
  address: string;
  trophies: number;
  joinedAt: number;
}

export interface Battle {
  id: string;
  player1: string;
  player2: string;
  status: 'pending' | 'in_progress' | 'completed';
  winner?: string;
  loser?: string;
  createdAt: number;
  completedAt?: number;
}

@Injectable()
export class GameService {
  private readonly queue: QueueEntry[] = [];
  private readonly battles = new Map<string, Battle>();
  private battleCounter = 0;

  constructor(private readonly playerService: PlayerService) {}

  /**
   * Add a player to the matchmaking queue.
   * If another player is already waiting, immediately create a battle.
   */
  joinQueue(address: string): { status: 'queued' } | { status: 'matched'; battle: Battle } {
    const normalizedAddress = address.toLowerCase();
    const player = this.playerService.getPlayer(normalizedAddress);

    if (!player) {
      throw new NotFoundException(
        'Player not registered. Register first via POST /player/register.',
      );
    }

    // Prevent duplicate queue entries
    const alreadyQueued = this.queue.find(
      (entry) => entry.address === normalizedAddress,
    );
    if (alreadyQueued) {
      throw new BadRequestException('Player is already in the queue.');
    }

    // Check if there is an opponent waiting
    if (this.queue.length > 0) {
      const opponent = this.queue.shift()!;

      const battle = this.createBattle(normalizedAddress, opponent.address);
      return { status: 'matched', battle };
    }

    // No opponent available - add to queue
    this.queue.push({
      address: normalizedAddress,
      trophies: player.trophies,
      joinedAt: Date.now(),
    });

    return { status: 'queued' };
  }

  /**
   * Create a new battle between two players.
   */
  private createBattle(player1: string, player2: string): Battle {
    this.battleCounter++;
    const id = `battle_${this.battleCounter}`;

    const battle: Battle = {
      id,
      player1,
      player2,
      status: 'in_progress',
      createdAt: Date.now(),
    };

    this.battles.set(id, battle);
    return battle;
  }

  /**
   * Submit the result of a battle. Awards trophies to the winner
   * and deducts from the loser.
   */
  submitBattleResult(
    battleId: string,
    winnerAddress: string,
  ): Battle {
    const battle = this.battles.get(battleId);

    if (!battle) {
      throw new NotFoundException(`Battle ${battleId} not found.`);
    }

    if (battle.status === 'completed') {
      throw new BadRequestException('Battle has already been completed.');
    }

    const normalizedWinner = winnerAddress.toLowerCase();

    if (
      normalizedWinner !== battle.player1 &&
      normalizedWinner !== battle.player2
    ) {
      throw new BadRequestException(
        'Winner address is not a participant in this battle.',
      );
    }

    const loser =
      normalizedWinner === battle.player1 ? battle.player2 : battle.player1;

    battle.status = 'completed';
    battle.winner = normalizedWinner;
    battle.loser = loser;
    battle.completedAt = Date.now();

    // Award / deduct trophies
    const trophiesAwarded = 30;
    const trophiesDeducted = 20;

    this.playerService.updateTrophies(normalizedWinner, trophiesAwarded);
    this.playerService.updateTrophies(loser, -trophiesDeducted);

    // Record wins / losses
    this.playerService.recordWin(normalizedWinner);
    this.playerService.recordLoss(loser);

    return battle;
  }

  /**
   * Get a battle by its ID.
   */
  getBattle(battleId: string): Battle {
    const battle = this.battles.get(battleId);
    if (!battle) {
      throw new NotFoundException(`Battle ${battleId} not found.`);
    }
    return battle;
  }

  /**
   * Get the current queue size.
   */
  getQueueSize(): number {
    return this.queue.length;
  }
}
