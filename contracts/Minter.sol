pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Minter is Ownable {

    mapping (address => bool) public minterUsers;
    event MinterUserAddressAdded(address addr);
    event MinterUserAddressRemoved(address addr);
    
    function Minter () public {
        addMinterUser(owner);
    }

    function isMinter(address _user) public view returns(bool) {
        return minterUsers[_user];
    }

    function addMinterUser (address _minter) onlyOwner public returns(bool success) {
        if (!minterUsers[_minter]) {
            minterUsers[_minter] = true;
            success = true;
            MinterUserAddressAdded(_minter);
            return success;
        }
    }

    function removeMinterUser (address _minter) onlyOwner public returns(bool success) {
        if (minterUsers[_minter]) {
            minterUsers[_minter] = false;
            success = true;
            MinterUserAddressRemoved(_minter);
            return success;
        }
   }

   modifier onlyMinter () {
       require(minterUsers[msg.sender]);
       _;
   }

}