import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
import { randomBytes } from 'crypto';

export interface AuthSession {
  address: string;
  authenticatedAt: number;
}

@Injectable()
export class AuthService {
  /** Maps wallet address (lowercase) -> nonce */
  private readonly nonces = new Map<string, string>();

  /** Maps wallet address (lowercase) -> session info */
  private readonly sessions = new Map<string, AuthSession>();

  /**
   * Generate a random nonce for the given wallet address.
   * The client must sign this nonce to prove ownership.
   */
  generateNonce(address: string): string {
    const normalizedAddress = address.toLowerCase();
    const nonce = randomBytes(32).toString('hex');
    this.nonces.set(normalizedAddress, nonce);
    return nonce;
  }

  /**
   * Verify a signed message following the SIWE pattern.
   * The message format is: "Sign in to HtsBots Arena\nNonce: <nonce>"
   * Returns the authenticated session if valid.
   */
  verifySignature(address: string, signature: string): AuthSession {
    const normalizedAddress = address.toLowerCase();
    const nonce = this.nonces.get(normalizedAddress);

    if (!nonce) {
      throw new UnauthorizedException(
        'No nonce found for this address. Request a nonce first.',
      );
    }

    const message = `Sign in to HtsBots Arena\nNonce: ${nonce}`;

    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch {
      throw new UnauthorizedException('Invalid signature format.');
    }

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      throw new UnauthorizedException(
        'Signature does not match the provided address.',
      );
    }

    // Nonce consumed - remove it to prevent replay attacks
    this.nonces.delete(normalizedAddress);

    const session: AuthSession = {
      address: normalizedAddress,
      authenticatedAt: Date.now(),
    };
    this.sessions.set(normalizedAddress, session);

    return session;
  }

  /**
   * Check whether an address has an active session.
   */
  getSession(address: string): AuthSession | undefined {
    return this.sessions.get(address.toLowerCase());
  }

  /**
   * Invalidate a session (logout).
   */
  removeSession(address: string): void {
    this.sessions.delete(address.toLowerCase());
  }
}
