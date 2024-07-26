// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/*
    Functionalities of this contract:
        -deposit tokens
        -withdraw tokens
        -check balances
        -make orders
        -cancel orders
        -fill orders
        -charge fees (& give to deployer)
        -track fee account
*/

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        //we will pass this value dynamically while deploying from test file
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
}
