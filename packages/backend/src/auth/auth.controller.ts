import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IsEthereumAddress, IsString, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';

class NonceRequestDto {
  @IsEthereumAddress()
  address: string;
}

class VerifyRequestDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}

class NonceResponseDto {
  nonce: string;
  message: string;
}

class VerifyResponseDto {
  address: string;
  authenticatedAt: number;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Request a nonce for wallet authentication',
    description:
      'Generates a random nonce tied to the wallet address. The client must sign the returned message to authenticate.',
  })
  @ApiBody({ type: NonceRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Nonce generated successfully',
    type: NonceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid wallet address' })
  requestNonce(@Body() dto: NonceRequestDto): NonceResponseDto {
    const nonce = this.authService.generateNonce(dto.address);
    return {
      nonce,
      message: `Sign in to HtsBots Arena\nNonce: ${nonce}`,
    };
  }

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verify a signed nonce to authenticate',
    description:
      'Verifies the wallet signature against the previously issued nonce (SIWE pattern). Returns session info on success.',
  })
  @ApiBody({ type: VerifyRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: VerifyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or missing signature' })
  verifySignature(@Body() dto: VerifyRequestDto): VerifyResponseDto {
    const session = this.authService.verifySignature(
      dto.address,
      dto.signature,
    );
    return {
      address: session.address,
      authenticatedAt: session.authenticatedAt,
    };
  }
}
