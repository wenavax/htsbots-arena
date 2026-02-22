import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { IsEthereumAddress, IsString, IsNotEmpty } from 'class-validator';
import { GameService, Battle } from './game.service';

class JoinQueueDto {
  @IsEthereumAddress()
  address: string;
}

class BattleResultDto {
  @IsString()
  @IsNotEmpty()
  battleId: string;

  @IsEthereumAddress()
  winnerAddress: string;
}

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('queue')
  @ApiOperation({
    summary: 'Join the matchmaking queue',
    description:
      'Adds the player to the matchmaking queue. If another player is already waiting, a battle is created immediately.',
  })
  @ApiBody({ type: JoinQueueDto })
  @ApiResponse({
    status: 201,
    description: 'Player queued or matched with an opponent',
  })
  @ApiResponse({ status: 400, description: 'Player already in queue' })
  @ApiResponse({ status: 404, description: 'Player not registered' })
  joinQueue(@Body() dto: JoinQueueDto) {
    return this.gameService.joinQueue(dto.address);
  }

  @Post('battle/result')
  @ApiOperation({
    summary: 'Submit a battle result',
    description:
      'Records the winner of a battle. Awards trophies to the winner and deducts from the loser.',
  })
  @ApiBody({ type: BattleResultDto })
  @ApiResponse({ status: 201, description: 'Battle result recorded' })
  @ApiResponse({ status: 400, description: 'Invalid result or already completed' })
  @ApiResponse({ status: 404, description: 'Battle not found' })
  submitResult(@Body() dto: BattleResultDto): Battle {
    return this.gameService.submitBattleResult(dto.battleId, dto.winnerAddress);
  }

  @Get('battle/:id')
  @ApiOperation({
    summary: 'Get battle details',
    description: 'Retrieve the details of a specific battle by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The battle ID' })
  @ApiResponse({ status: 200, description: 'Battle details returned' })
  @ApiResponse({ status: 404, description: 'Battle not found' })
  getBattle(@Param('id') id: string): Battle {
    return this.gameService.getBattle(id);
  }

  @Get('queue/status')
  @ApiOperation({
    summary: 'Get matchmaking queue status',
    description: 'Returns the number of players currently waiting in the queue.',
  })
  @ApiResponse({ status: 200, description: 'Queue status returned' })
  getQueueStatus() {
    return {
      playersInQueue: this.gameService.getQueueSize(),
    };
  }
}
