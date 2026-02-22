// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {HtsBToken} from "./HtsBToken.sol";

/// @title HtsBotArena
/// @notice Core game contract for HtsBots Arena. Records PvP battle results
///         on-chain and distributes HTSB token rewards to winners.
/// @dev Requires MINTER_ROLE on the HtsBToken contract so it can mint rewards.
contract HtsBotArena is Ownable, Pausable, ReentrancyGuard {
    // ---------------------------------------------------------------
    //  Types
    // ---------------------------------------------------------------

    struct BattleResult {
        uint256 battleId;
        uint256 winnerTokenId;
        uint256 loserTokenId;
        address winnerOwner;
        address loserOwner;
        uint256 reward;
        uint256 timestamp;
    }

    // ---------------------------------------------------------------
    //  State
    // ---------------------------------------------------------------

    IERC721 public immutable botNFT;
    HtsBToken public immutable htsbToken;

    /// @notice HTSB tokens awarded per battle win (default 100 HTSB).
    uint256 public rewardPerWin = 100 ether;

    /// @notice Auto-incrementing battle counter.
    uint256 public nextBattleId;

    /// @notice battleId => BattleResult
    mapping(uint256 => BattleResult) public battles;

    /// @notice tokenId => total wins
    mapping(uint256 => uint256) public botWins;

    /// @notice tokenId => total losses
    mapping(uint256 => uint256) public botLosses;

    /// @notice tokenId => total HTSB earned
    mapping(uint256 => uint256) public botEarnings;

    /// @notice Addresses authorised to submit battle results (game servers).
    mapping(address => bool) public reporters;

    // ---------------------------------------------------------------
    //  Events
    // ---------------------------------------------------------------

    event BattleRecorded(
        uint256 indexed battleId,
        uint256 indexed winnerTokenId,
        uint256 indexed loserTokenId,
        address winnerOwner,
        address loserOwner,
        uint256 reward
    );

    event RewardPerWinUpdated(uint256 oldReward, uint256 newReward);
    event ReporterUpdated(address indexed reporter, bool active);

    // ---------------------------------------------------------------
    //  Errors
    // ---------------------------------------------------------------

    error NotReporter();
    error InvalidTokenIds();
    error TokenOwnerMismatch();
    error ZeroAddress();

    // ---------------------------------------------------------------
    //  Modifiers
    // ---------------------------------------------------------------

    modifier onlyReporter() {
        if (!reporters[msg.sender]) revert NotReporter();
        _;
    }

    // ---------------------------------------------------------------
    //  Constructor
    // ---------------------------------------------------------------

    /// @param initialOwner  Admin / owner of the arena contract.
    /// @param _botNFT       Address of the HtsBotNFT contract.
    /// @param _htsbToken    Address of the HtsBToken contract.
    constructor(
        address initialOwner,
        address _botNFT,
        address _htsbToken
    ) Ownable(initialOwner) {
        if (_botNFT == address(0) || _htsbToken == address(0))
            revert ZeroAddress();

        botNFT = IERC721(_botNFT);
        htsbToken = HtsBToken(_htsbToken);

        // The deployer is the first reporter by default.
        reporters[initialOwner] = true;
        emit ReporterUpdated(initialOwner, true);
    }

    // ---------------------------------------------------------------
    //  Reporter functions — battle recording
    // ---------------------------------------------------------------

    /// @notice Record a PvP battle result and distribute rewards.
    /// @param winnerTokenId  NFT token ID of the winning bot.
    /// @param loserTokenId   NFT token ID of the losing bot.
    /// @return battleId      The ID assigned to this battle.
    function recordBattle(
        uint256 winnerTokenId,
        uint256 loserTokenId
    )
        external
        onlyReporter
        whenNotPaused
        nonReentrant
        returns (uint256 battleId)
    {
        if (winnerTokenId == loserTokenId) revert InvalidTokenIds();

        address winnerOwner = botNFT.ownerOf(winnerTokenId);
        address loserOwner = botNFT.ownerOf(loserTokenId);

        battleId = nextBattleId;
        unchecked {
            nextBattleId++;
        }

        uint256 reward = rewardPerWin;

        battles[battleId] = BattleResult({
            battleId: battleId,
            winnerTokenId: winnerTokenId,
            loserTokenId: loserTokenId,
            winnerOwner: winnerOwner,
            loserOwner: loserOwner,
            reward: reward,
            timestamp: block.timestamp
        });

        // Update stats
        unchecked {
            botWins[winnerTokenId]++;
            botLosses[loserTokenId]++;
            botEarnings[winnerTokenId] += reward;
        }

        // Mint reward tokens to the winner
        if (reward > 0) {
            htsbToken.mintReward(winnerOwner, reward);
        }

        emit BattleRecorded(
            battleId,
            winnerTokenId,
            loserTokenId,
            winnerOwner,
            loserOwner,
            reward
        );
    }

    // ---------------------------------------------------------------
    //  Owner-only configuration
    // ---------------------------------------------------------------

    /// @notice Set or revoke a reporter address.
    function setReporter(address reporter, bool active) external onlyOwner {
        if (reporter == address(0)) revert ZeroAddress();
        reporters[reporter] = active;
        emit ReporterUpdated(reporter, active);
    }

    /// @notice Update the HTSB reward per win.
    function setRewardPerWin(uint256 newReward) external onlyOwner {
        uint256 oldReward = rewardPerWin;
        rewardPerWin = newReward;
        emit RewardPerWinUpdated(oldReward, newReward);
    }

    /// @notice Pause battle recording.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause battle recording.
    function unpause() external onlyOwner {
        _unpause();
    }

    // ---------------------------------------------------------------
    //  View helpers
    // ---------------------------------------------------------------

    /// @notice Get the full record for a bot (wins, losses, earnings).
    /// @return wins    Total wins for the bot.
    /// @return losses  Total losses for the bot.
    /// @return earned  Total HTSB tokens earned by the bot.
    function getBotRecord(
        uint256 tokenId
    ) external view returns (uint256 wins, uint256 losses, uint256 earned) {
        wins = botWins[tokenId];
        losses = botLosses[tokenId];
        earned = botEarnings[tokenId];
    }
}
