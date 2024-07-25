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

    //this will be a nested mapping that will be used in transfer approval
    mapping(address => mapping(address => uint256)) public allowance;
    //here 1st key is sender address, 2nd key is address of receiver that returns number of tokens approved for transfer
    //1st is of owner & 2nd address is of individual spender that is allowed to spend a number of tokens that are approved and it returns that number

    //transfer event (that we will emit when transfer function is executed)
    event Transfer(address indexed from, address indexed to, uint256 value);

    //Approval event that will be emitted/triggered on every succesful call to approve
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

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

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        //require if sender has enough tokens to send
        require(balanceOf[msg.sender] >= _value); //*if this statement is true, rest of function lines gets executed & if false that function retunrs from here itself without executing further
        require(_to != address(0)); //this checks if reciever is 0 address i.e; invalid and returns if invalid address

        //deduct tokens from sender
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        // credit (add) to receiver
        balanceOf[_to] = balanceOf[_to] + _value;

        //Emit event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value; //this is how value is assigned to nested mapping (1st value goes to 1st key and 2nd to 2nd key that points to a value i.e; number of tokens approved)

        require(_spender != address(0));

        //emit Approval event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }
}
