// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0;

contract Meme {

  // array of structs 
  struct userData {
    bytes32[] imageHashes;
    bool userExists; // 0 default 
  }

  mapping (address => userData) idUserData;

  bytes32[] initArr;
  function signUpUserOrLogin() public { // returns(address) {
    // address _address
    if (!idUserData[msg.sender].userExists) {
      idUserData[msg.sender].imageHashes = initArr;
      idUserData[msg.sender].userExists = true;
    } // else user already exists  try catch
    // return msg.sender;
  }

  function set(address userAddress, bytes32 _imageHash) public { // abstract 0.7.3
    idUserData[userAddress].imageHashes.push(_imageHash);
  }

  function get(address userAddress) public view returns (bytes32[] memory) { //internal dwk
    return idUserData[userAddress].imageHashes; //imageHashes;
  }

  // bytes32[] public imageHashes;
  // function set(bytes32 _imageHash) public { // abstract 0.7.0
  //   imageHashes.push(_imageHash);
  // }

  // function get() public view returns (bytes32[] memory) { //internal dw
  //   return imageHashes;
  // }
}