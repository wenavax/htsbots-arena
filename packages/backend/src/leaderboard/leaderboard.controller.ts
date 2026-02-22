import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { LeaderboardService, LeaderboardEntry } from './leaderboard.service';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the leaderboard',
    description:
      'Returns the top players ranked by trophies. Use the limit query param to control how many entries are returned.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of entries to return (default 50)',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard entries sorted by trophies descending',
  })
  getLeaderboard(
    @Query('limit') limit?: string,
  ): LeaderboardEntry[] {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    const safeLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 50 : parsedLimit;
    return this.leaderboardService.getLeaderboard(safeLimit);
  }

  @Get('rank/:address')
  @ApiOperation({
    summary: 'Get a player\'s rank',
    description: 'Returns the rank of a specific player on the leaderboard.',
  })
  @ApiParam({
    name: 'address',
    description: 'Ethereum wallet address of the player',
  })
  @ApiResponse({ status: 200, description: 'Player rank returned' })
  getPlayerRank(@Param('address') address: string) {
    const rank = this.leaderboardService.getPlayerRank(address);
    return {
      address: address.toLowerCase(),
      rank: rank ?? null,
      ranked: rank !== null,
    };
  }
}
