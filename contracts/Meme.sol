// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Meme is Ownable, AccessControl {

  bytes32 public constant USER_ROLE = keccak256("USER_ROLE"); //  enum State { Created, Locked, Inactive }
  
  // array of structs // 0 default 
  struct userData {
    bytes32[] imageHashes;
    bool userExists; 
    bytes32[] imageHashesSharedWithUser;
  }

  mapping (address => userData) idUserData;

  // onlyOwner fun that add users 
  bytes32[] initArr;
  bytes32[] initArrShared;
  function signUpUserOrLogin() public { // onlyOwner { acc2 can connect, acc3,4 cannot }
    // owner = msg.sender;
    if (!idUserData[msg.sender].userExists) {
      idUserData[msg.sender].imageHashes = initArr;
      idUserData[msg.sender].userExists = true;
      // check why do that******** Sign up problem
      idUserData[msg.sender].imageHashesSharedWithUser;// = initArrShared;

      _setupRole(USER_ROLE, msg.sender);
    } // else user already exists
  }

  // set msg.sender [from who it was shared] 
  function shareImage(address _address, bytes32 _imageHash) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    // prevents duplicate images from being inserted (shared again)
    bool duplicateFound = false;
    for (uint i = 0; i < idUserData[_address].imageHashesSharedWithUser.length; i++) {
      if (idUserData[_address].imageHashesSharedWithUser[i] == _imageHash) {
        duplicateFound = true;
        break;
      }
    }
    if (!duplicateFound)
      idUserData[_address].imageHashesSharedWithUser.push(_imageHash);
  }

  function getSharedImageArr() public view returns (bytes32[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return idUserData[msg.sender].imageHashesSharedWithUser; 
  }

  function set(bytes32 _imageHash) public { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    idUserData[msg.sender].imageHashes.push(_imageHash);
  }

  function get() public view returns (bytes32[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return idUserData[msg.sender].imageHashes; 
  }

  // delete: reset variable to default value
  // function deleteImage(address userAddress, uint index) public {
  //   delete idUserData[userAddress].imageHashes[index];
  // }

  // bytes32[] public imageHashes;
  // function set(bytes32 _imageHash) public { // abstract 0.7.0
  //   imageHashes.push(_imageHash);
  // }

  // function get() public view returns (bytes32[] memory) { //internal dw
  //   return imageHashes;
  // }
}