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
  }

  mapping (address => userData) idUserData;

  // onlyOwner fun that add users 
  bytes32[] initArr;
  function signUpUserOrLogin() public { // onlyOwner { acc2 can connect, acc3,4 cannot }
    // owner = msg.sender;
    if (!idUserData[msg.sender].userExists) {
      idUserData[msg.sender].imageHashes = initArr;
      idUserData[msg.sender].userExists = true;

      _setupRole(USER_ROLE, msg.sender);
    } // else user already exists  try catch
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