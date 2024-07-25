// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name;

    string public symbol;

    uint256 public decimals = 18; //as the ether also as 18 zeroes after it in wei value, we also take this standard value
    //we keep this static as its a global convention

    uint256 public totalSupply;

    //its value will be: 1000000 * (10**decimals)
    //this is wei value of total supply that is in token amount our supply is 1 million
    // this is solidity maths using exponent i.e; its = 1,000,000 x 10^18
    //we want to store the wei equaivalent as we want our token to be 1 million in number, so instead of storing 1 million in value, we store 1 million with extra 18 zeroes
    //in conclusion, this value will be equal to: 1000000000000000000000000 (1 with 6+18 zeroes (6 of million & 18 of decimals))

    //Tracking Balance (using mapping with address as key & balance as value)
    mapping(address => uint256) public balanceOf; //we initialize in constructor

    //Sending Tokens

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals); //to make in wei value we multiply
        balanceOf[msg.sender] = totalSupply; //msg.sender is the deployer of contract & we provide it all the tokens
    }
    //we will pass in args in deploy() method as it calls constructor in test file of token
}
