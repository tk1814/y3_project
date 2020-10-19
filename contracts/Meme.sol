// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0;
// pragma experimental ABIEncoderV2;

contract Meme {

// array of structs 
  struct userData {
    bytes32[] imageHashes;
    bool userExists; // 0 default 
  }

  mapping (address => userData) idUserData;

  bytes32[] initArr;
  function signUpUserOrLogin(address _address) public returns (bool) {
    bool authenticated = true;

    if (!idUserData[_address].userExists) {
      idUserData[_address].imageHashes = initArr;
      idUserData[_address].userExists = true;
    } // else user already exists  try catch

    return authenticated;
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