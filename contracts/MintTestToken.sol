pragma solidity ^0.4.18;

import "./Minter.sol";
import "./TestToken.sol";

contract MintTestToken is Minter, TestToken {

    uint8  releasePercent;
    uint32  frozenTime;
    uint32  nextIterTime;

    struct FreezeBalance {
        uint256 startTime;
        uint256 amount;
        uint256 released;
    }
    
    mapping (address => FreezeBalance[]) freezeBalances;  

    event AddTokenToBalace (uint amount, address user);
    event UnfreezeTokenToBalace (uint amount, address user);
    
    function MintTestToken(
        uint32 _frozenTime, 
        uint8 _releasePercent, 
        uint32 _nextIterTime 
    ) public 
    {
        
        frozenTime = _frozenTime;
        releasePercent = _releasePercent;
        nextIterTime = _nextIterTime;
    }

    function userFreezeBalance(address _user) public view returns (uint) {

        require(_user != address(0));

        uint balance = 0;
        var tokens = freezeBalances[_user];

        for (uint i; i < tokens.length; i++) {
            balance += tokens[i].amount - tokens[i].released;
        }

        return balance;
    }

    function mint(address _user, uint _amount) onlyMinter external {

        require(_user != address(0));
        freezeBalances[_user].push(FreezeBalance(currentTime(), _amount, 0));
        AddTokenToBalace(_amount, _user);
    }

    function releaseToken () external {
        var userFreezeBalances = freezeBalances[msg.sender];
        
        for (uint balanceIndex = 0; balanceIndex < userFreezeBalances.length; balanceIndex++) {
            var freezeBalance = userFreezeBalances[balanceIndex];
            if (freezeBalance.amount != freezeBalance.released) {
            
                if (freezeBalance.startTime + frozenTime <= currentTime()) {
                    
                    uint activeTime = currentTime() - (freezeBalance.startTime + frozenTime);
                    uint activeIters = activeTime / nextIterTime + 1;
                    uint unfrozenBalance = freezeBalance.amount * activeIters * releasePercent / 100 - freezeBalance.released;
                    
                    if (unfrozenBalance > freezeBalance.amount - freezeBalance.released) {

                        unfrozenBalance = freezeBalance.amount - freezeBalance.released;

                    } else {
                        
                        require(freezeBalance.amount * activeIters * releasePercent / 100 == freezeBalance.released + unfrozenBalance);
                    }
                    
                    freezeBalance.released += unfrozenBalance;
                    addBalance(msg.sender, unfrozenBalance);
                    UnfreezeTokenToBalace(unfrozenBalance, msg.sender);
                }       
            }
        }
    }

    function currentTime() public view returns (uint256 _currentTime) {
        return now;
    }

}