// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0;
// pragma experimental ABIEncoderV2;

contract Meme {

  bytes32[] public imageHashes;

  function set(bytes32 _imageHash) public { // abstract 0.7.0
    imageHashes.push(_imageHash);
  }

  function get() public view returns (bytes32[] memory) { //internal dw
    return imageHashes;
  }
}