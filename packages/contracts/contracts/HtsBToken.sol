// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title HtsBToken (HTSB)
/// @notice ERC-20 utility token used as the reward currency in HtsBots Arena.
/// @dev The deployer receives the initial supply and DEFAULT_ADMIN_ROLE.
///      A separate MINTER_ROLE is granted to the Arena game contract so it
///      can mint rewards on-chain.
contract HtsBToken is ERC20, ERC20Burnable, AccessControl {
    // ---------------------------------------------------------------
    //  Roles
    // ---------------------------------------------------------------

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // ---------------------------------------------------------------
    //  Constants
    // ---------------------------------------------------------------

    /// @notice Initial supply minted to the deployer (1 billion tokens).
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 ether;

    // ---------------------------------------------------------------
    //  Events
    // ---------------------------------------------------------------

    event RewardMinted(address indexed to, uint256 amount);

    // ---------------------------------------------------------------
    //  Errors
    // ---------------------------------------------------------------

    error ZeroAddress();
    error ZeroAmount();

    // ---------------------------------------------------------------
    //  Constructor
    // ---------------------------------------------------------------

    /// @param initialOwner Address that receives the initial supply and admin role.
    constructor(
        address initialOwner
    ) ERC20("HtsBots Token", "HTSB") {
        if (initialOwner == address(0)) revert ZeroAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    // ---------------------------------------------------------------
    //  Minter functions
    // ---------------------------------------------------------------

    /// @notice Mint new tokens. Only callable by addresses with MINTER_ROLE.
    /// @param to   Recipient of newly minted tokens.
    /// @param amount Number of tokens (in wei) to mint.
    function mintReward(
        address to,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        _mint(to, amount);
        emit RewardMinted(to, amount);
    }
}
