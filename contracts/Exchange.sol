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

    //mapping for making order with id as key & it points to struct _Order
    mapping(uint256 => _Order) public orders; //1st key is id that is of order & value it points to is our struct _Order

    //? we dont want to delete orders from chain, we just create then & mark the cancelled orders, we don't delete them from chain

    //mapping for canceling order with id as key & it points to bool value of cancel operation result
    mapping(uint256 => bool) public orderCancelled; //1st key is id that is of order & value it points to bool value of cancel operation result

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    uint256 public orderCount; //this will bw used as id for each order made & updated with increase in order (when no orders are made then initial value is 0)
    //struct for order to organize data associated: (we will use this order in order mapping above)
    struct _Order {
        //attributes of order:
        uint256 id; //unique identity for order, to track orders
        address user; //address of user who made order
        address tokenGet; //address of token they receive
        uint256 amountGet; //amount of token they receive
        address tokenGive; //address of token they give
        uint256 amountGive; //amount of token they give
        uint256 timestamp; //when order was made (this will be in epoch time that is number of seconds that have passed from 1st January 1970)
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        //we will pass this value dynamically while deploying from test file
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //! Deposit Token
    function depositToken(address _token, uint256 _amount) public {
        //*transfer tokens to exchange (for this we use a method from Token contract by instantiating it using concerned token address)
        require(Token(_token).transferFrom(msg.sender, address(this), _amount)); //here inside require is used for referring to this account from original  function definition (i.e; it is referencing address of this smart contract from another smart contract)

        //*update user balance & we made it inside require for extra protection so that if this is not true(cannot run) then function returns from here without executing further which give us extra layer of security
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount; //adding amount deposited to user of concerned token
        //if nothing is deposited first, default value is 0 so amount dposited will be added to 0 at first

        //*emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //! withdraw tokens
    function withdrawToken(address _token, uint256 _amount) public {
        //*ensure user has enough tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount);

        //*transfer tokens to user
        Token(_token).transfer(msg.sender, _amount);

        //*update user balace
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount; //now withdrawing so we subtract

        //*emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //! Check Balance
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user]; //by this we are reading number of tokens user has in our nested mapping
    }

    //! making orders:
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        //-Token Give (the token the want to spend) - which token & how much
        //-Token Get (the token the want to receive) - which token & how much

        //require token balance before making orders
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

        // instantiate new order
        orderCount = orderCount + 1; //this is for increasing count of order with each order made that will be used as id for order
        orders[orderCount] = _Order(
            orderCount, //id of order
            msg.sender, //user who made order
            _tokenGet, //token that will be recieved
            _amountGet, //amount that will be recieved
            _tokenGive, //token that will be given
            _amountGive, //amount that will be given
            block.timestamp //timestamp when order was made (this will be in epoch time that is number of seconds that have passed from 1st January 1970)
        );

        //emit a order event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    //! cancel orders:
    function cancelOrder(uint256 _id) public {
        //fetch order that is to be canceled
        _Order storage _order = orders[_id]; //fethcing order from storage's _Order struct & assigning to _order

        //user must own the order to cencel it i.e; we don't want anyone to cancel other persons order
        //i.e; we ensure caller of function is owner of the order
        require(address(_order.user) == msg.sender);

        //order must exist: (i.e; no invalid order id cancellation)
        require(_order.id == _id);

        //cancel order
        orderCancelled[_id] = true;

        //emit cancel event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }
}
