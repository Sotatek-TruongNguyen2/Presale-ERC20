// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../tokens/ERC20/ERC20.sol";

contract MockERC20V2 is ERC20 {
    constructor(
        string memory name_, 
        string memory symbol_, 
        uint _initialSupply
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, _initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 4;
    }
}