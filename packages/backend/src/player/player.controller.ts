import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { IsEthereumAddress, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { PlayerService, Player } from './player.service';

class RegisterPlayerDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;
}

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new player',
    description:
      'Creates a new player profile linked to a wallet address. Username must be 3-20 characters (alphanumeric and underscores).',
  })
  @ApiBody({ type: RegisterPlayerDto })
  @ApiResponse({ status: 201, description: 'Player registered successfully' })
  @ApiResponse({ status: 409, description: 'Address or username already taken' })
  register(@Body() dto: RegisterPlayerDto): Player {
    return this.playerService.register(dto.address, dto.username);
  }

  @Get(':address')
  @ApiOperation({
    summary: 'Get player profile',
    description: 'Retrieve a player profile by their wallet address.',
  })
  @ApiParam({
    name: 'address',
    description: 'Ethereum wallet address of the player',
  })
  @ApiResponse({ status: 200, description: 'Player profile returned' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  getPlayer(@Param('address') address: string): Player {
    return this.playerService.getPlayerOrFail(address);
  }
}
