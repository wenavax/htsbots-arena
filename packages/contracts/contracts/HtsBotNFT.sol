// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title HtsBotNFT
/// @notice ERC-721 contract representing bots in the HtsBots Arena game.
/// @dev Each token represents a unique bot with on-chain metadata URI.
contract HtsBotNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    // ---------------------------------------------------------------
    //  State
    // ---------------------------------------------------------------

    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public mintPrice = 0.01 ether;
    string public baseTokenURI;

    uint256 private _nextTokenId;

    // ---------------------------------------------------------------
    //  Events
    // ---------------------------------------------------------------

    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event BaseURIUpdated(string oldURI, string newURI);
    event FundsWithdrawn(address indexed to, uint256 amount);

    // ---------------------------------------------------------------
    //  Errors
    // ---------------------------------------------------------------

    error MaxSupplyReached();
    error InsufficientPayment();
    error WithdrawalFailed();
    error ZeroAddress();

    // ---------------------------------------------------------------
    //  Constructor
    // ---------------------------------------------------------------

    /// @param initialOwner The address that will own the contract.
    /// @param _baseTokenURI The initial base URI for token metadata.
    constructor(
        address initialOwner,
        string memory _baseTokenURI
    ) ERC721("HtsBot", "HBOT") Ownable(initialOwner) {
        baseTokenURI = _baseTokenURI;
    }

    // ---------------------------------------------------------------
    //  Public / External — Minting
    // ---------------------------------------------------------------

    /// @notice Mint a new bot NFT.
    /// @param to Recipient of the newly minted token.
    /// @param uri Token-level metadata URI (can be empty to rely on baseURI).
    /// @return tokenId The ID of the minted token.
    function mint(
        address to,
        string calldata uri
    ) external payable whenNotPaused nonReentrant returns (uint256 tokenId) {
        if (to == address(0)) revert ZeroAddress();
        if (msg.value < mintPrice) revert InsufficientPayment();
        if (_nextTokenId >= MAX_SUPPLY) revert MaxSupplyReached();

        tokenId = _nextTokenId;
        unchecked {
            _nextTokenId++;
        }

        _safeMint(to, tokenId);

        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }
    }

    // ---------------------------------------------------------------
    //  Owner-only configuration
    // ---------------------------------------------------------------

    /// @notice Update the per-mint price.
    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice);
    }

    /// @notice Update the base token URI applied to all tokens.
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        string memory oldURI = baseTokenURI;
        baseTokenURI = newBaseURI;
        emit BaseURIUpdated(oldURI, newBaseURI);
    }

    /// @notice Pause minting.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause minting.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Withdraw collected ETH to the owner.
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert WithdrawalFailed();
        emit FundsWithdrawn(owner(), balance);
    }

    // ---------------------------------------------------------------
    //  View helpers
    // ---------------------------------------------------------------

    /// @notice Total number of tokens minted so far.
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    // ---------------------------------------------------------------
    //  Internal overrides (required by Solidity for multiple inheritance)
    // ---------------------------------------------------------------

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
