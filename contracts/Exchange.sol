// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

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

    mapping(address => mapping(address => uint256)) public tokens; //here 1st key is for token, 2nd for user and 3rd for amount

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) {
        //we will pass this value dynamically while deploying from test file
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //Deposit Token
    function depositToken(address _token, uint256 _amount) public {
        //transfer tokens to exchange (for this we use a method from Token contract by instantiating it using concerned token address)
        require(Token(_token).transferFrom(msg.sender, address(this), _amount)); //here inside require is used for referring to this account from original  function definition (i.e; it is referencing address of this smart contract from another smart contract)
        //update user balance & we made it inside require for extra protection so that if this is not true(cannot run) then function returns from here without executing further which give us extra layer of security
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount; //adding amount deposited to user of concerned token
        //if nothing is deposited first, default value is 0 so amount dposited will be added to 0 at first
        //emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //Check Balance
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user]; //by this we are reading number of tokens user has in our nested mapping
    }
}
