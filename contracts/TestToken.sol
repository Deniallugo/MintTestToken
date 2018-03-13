pragma solidity ^0.4.18;

import "./Minter.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract TestToken is StandardToken,  Minter {

    string public name = "TestToken"; 
    string public symbol = "TET";
    uint public decimals = 2;
    uint public INITIAL_SUPPLY = 10000 * (10 ** decimals);

    function TestToken() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function addBalance(address user, uint amount) internal {
        balances[user] += amount;
    }

}