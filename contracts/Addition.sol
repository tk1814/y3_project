// SPDX-License-Identifier: <SPDX-License>
pragma solidity >=0.5.0;

contract Addition {
  int public sum = 0;

function add (int x, int y) public {
    sum = x + y;
  }
}