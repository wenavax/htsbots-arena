import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  // ---------------------------------------------------------------
  //  1. Deploy HtsBotNFT
  // ---------------------------------------------------------------
  const baseTokenURI = process.env.BASE_TOKEN_URI ?? "https://api.htsbots.gg/metadata/";

  console.log("\n--- Deploying HtsBotNFT ---");
  const HtsBotNFT = await ethers.getContractFactory("HtsBotNFT");
  const botNFT = await HtsBotNFT.deploy(deployer.address, baseTokenURI);
  await botNFT.waitForDeployment();
  const botNFTAddress = await botNFT.getAddress();
  console.log("HtsBotNFT deployed to:", botNFTAddress);

  // ---------------------------------------------------------------
  //  2. Deploy HtsBToken
  // ---------------------------------------------------------------
  console.log("\n--- Deploying HtsBToken ---");
  const HtsBToken = await ethers.getContractFactory("HtsBToken");
  const htsbToken = await HtsBToken.deploy(deployer.address);
  await htsbToken.waitForDeployment();
  const htsbTokenAddress = await htsbToken.getAddress();
  console.log("HtsBToken deployed to:", htsbTokenAddress);

  // ---------------------------------------------------------------
  //  3. Deploy HtsBotArena
  // ---------------------------------------------------------------
  console.log("\n--- Deploying HtsBotArena ---");
  const HtsBotArena = await ethers.getContractFactory("HtsBotArena");
  const arena = await HtsBotArena.deploy(
    deployer.address,
    botNFTAddress,
    htsbTokenAddress
  );
  await arena.waitForDeployment();
  const arenaAddress = await arena.getAddress();
  console.log("HtsBotArena deployed to:", arenaAddress);

  // ---------------------------------------------------------------
  //  4. Grant MINTER_ROLE to the Arena contract on HtsBToken
  // ---------------------------------------------------------------
  console.log("\n--- Granting MINTER_ROLE to Arena ---");
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const grantTx = await htsbToken.grantRole(MINTER_ROLE, arenaAddress);
  await grantTx.wait();
  console.log("MINTER_ROLE granted to Arena at:", arenaAddress);

  // ---------------------------------------------------------------
  //  Summary
  // ---------------------------------------------------------------
  console.log("\n========================================");
  console.log("  HtsBots Arena — Deployment Summary");
  console.log("========================================");
  console.log(`  HtsBotNFT  : ${botNFTAddress}`);
  console.log(`  HtsBToken  : ${htsbTokenAddress}`);
  console.log(`  HtsBotArena: ${arenaAddress}`);
  console.log("========================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
