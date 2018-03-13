pragma solidity ^0.4.18;

import "./MintTestToken.sol";

contract MintTestTokenMock is MintTestToken () {

  uint256 public _now;

    function MintTestTokenMock (
        uint32 _frozenTime, 
        uint8 _releasePercent, 
        uint32 _nextIterTime, 
        uint256 _currentTime

    ) public MintTestToken (_frozenTime, _releasePercent, _nextIterTime)
    {
        _now = _currentTime;
    }

    function currentTime() public view returns (uint256 _currentTime) {
        return _now;
    }

    function changeTime(uint256 _newTime) public {
        _now = _newTime;
    }

}