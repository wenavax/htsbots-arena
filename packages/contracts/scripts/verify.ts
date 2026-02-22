import { run } from "hardhat";

/**
 * Verification script for HtsBots Arena contracts on BaseScan.
 *
 * Usage:
 *   npx hardhat run scripts/verify.ts --network baseSepolia
 *
 * You can pass deployed addresses via environment variables:
 *   HTSBOT_NFT_ADDRESS=0x...  HTSB_TOKEN_ADDRESS=0x...  ARENA_ADDRESS=0x...  \
 *     npx hardhat run scripts/verify.ts --network baseSepolia
 *
 * Or edit the fallback addresses below after deployment.
 */

// ---------------------------------------------------------------------------
//  Fallback addresses — replace with your actual deployed addresses
// ---------------------------------------------------------------------------
const HTSBOT_NFT_ADDRESS =
  process.env.HTSBOT_NFT_ADDRESS ?? "0x_REPLACE_WITH_HTSBOT_NFT_ADDRESS";
const HTSB_TOKEN_ADDRESS =
  process.env.HTSB_TOKEN_ADDRESS ?? "0x_REPLACE_WITH_HTSB_TOKEN_ADDRESS";
const ARENA_ADDRESS =
  process.env.ARENA_ADDRESS ?? "0x_REPLACE_WITH_ARENA_ADDRESS";

// ---------------------------------------------------------------------------
//  Constructor arguments (must match what was used during deployment)
// ---------------------------------------------------------------------------
const DEPLOYER_ADDRESS =
  process.env.DEPLOYER_ADDRESS ?? "0x_REPLACE_WITH_DEPLOYER_ADDRESS";
const BASE_TOKEN_URI =
  process.env.BASE_TOKEN_URI ?? "https://api.htsbots.gg/metadata/";

async function verifyContract(
  name: string,
  address: string,
  constructorArguments: unknown[]
) {
  console.log(`\nVerifying ${name} at ${address} ...`);
  try {
    await run("verify:verify", {
      address,
      constructorArguments,
    });
    console.log(`${name} verified successfully.`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes("already verified")) {
      console.log(`${name} is already verified.`);
    } else {
      console.error(`Failed to verify ${name}:`, msg);
    }
  }
}

async function main() {
  console.log("========================================");
  console.log("  HtsBots Arena — Contract Verification");
  console.log("========================================");

  // 1. Verify HtsBotNFT
  await verifyContract("HtsBotNFT", HTSBOT_NFT_ADDRESS, [
    DEPLOYER_ADDRESS,
    BASE_TOKEN_URI,
  ]);

  // 2. Verify HtsBToken
  await verifyContract("HtsBToken", HTSB_TOKEN_ADDRESS, [DEPLOYER_ADDRESS]);

  // 3. Verify HtsBotArena
  await verifyContract("HtsBotArena", ARENA_ADDRESS, [
    DEPLOYER_ADDRESS,
    HTSBOT_NFT_ADDRESS,
    HTSB_TOKEN_ADDRESS,
  ]);

  console.log("\n========================================");
  console.log("  Verification complete.");
  console.log("========================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
