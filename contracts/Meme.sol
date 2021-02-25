// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.6.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Meme is Ownable, AccessControl {

  bytes32 public constant USER_ROLE = keccak256("USER_ROLE"); //  enum State { Created, Locked, Inactive }
  
  // array of structs // 0 default 
  struct userData {

    bool userExists; 
    string username;

    bytes32[] imageHashes;
    bytes32[] imageNames;
    bytes32[] imageHashesSharedWithUser;
    bytes32[] imageNamesSharedWithUser;
    string[] dateImageUpload;

    bytes32[] fileHashes;
    bytes32[] fileNames;
    bytes32[] fileHashesSharedWithUser;
    bytes32[] fileNamesSharedWithUser;
    string[] dateFileUpload;

    address[] addressSharedWithUser;
    address[] fileAddressSharedWithUser;
    string[] usernameSharedWithUser;
    string[] fileUsernameSharedWithUser;

    string[] dateImageShareWithUser;
    string[] dateFileShareWithUser;
  }

  mapping (address => userData) idUserData;

  // onlyOwner fun that add users 
  bytes32[] initArr;
  bytes32[] initArrShared;
  function signUpUserOrLogin(string memory _usr) public { // onlyOwner { acc2 can connect, acc3,4 cannot }
    // owner = msg.sender;
    if (!idUserData[msg.sender].userExists) {
      // idUserData[msg.sender].imageHashes = initArr;
      // idUserData[msg.sender].imageNames = initArr;
      // idUserData[msg.sender].fileHashes = initArr;
      // idUserData[msg.sender].fileNames = initArr;
      idUserData[msg.sender].userExists = true;
      idUserData[msg.sender].username = _usr;
      // check why do that******** Sign up problem
      // idUserData[msg.sender].imageHashesSharedWithUser;// = initArrShared;
      // idUserData[msg.sender].imageNamesSharedWithUser; 
      // idUserData[msg.sender].fileHashesSharedWithUser;// = initArrShared;
      // idUserData[msg.sender].fileNamesSharedWithUser; 
      // idUserData[msg.sender].addressSharedWithUser;
      // idUserData[msg.sender].usernameSharedWithUser;
      // idUserData[msg.sender].fileAddressSharedWithUser;   
      // idUserData[msg.sender].fileUsernameSharedWithUser;  

      _setupRole(USER_ROLE, msg.sender);
    } // else user already exists
  }

  // set msg.sender [from who it was shared] 
  function shareImage(string memory _usrName, address _address, bytes32 _imageHash, bytes32 _imageName, string memory _date) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    // prevents duplicate images from being inserted (shared again) - if same file and same address shared the file - do not allow
    bool duplicateFound = false;
    for (uint i = 0; i < idUserData[_address].imageHashesSharedWithUser.length; i++) {
      if (idUserData[_address].imageHashesSharedWithUser[i] == _imageHash && idUserData[_address].addressSharedWithUser[i] == msg.sender && idUserData[_address].imageNamesSharedWithUser == _imageName) {
        duplicateFound = true;
        break;
      }
    }
    if (!duplicateFound) {
      idUserData[_address].imageHashesSharedWithUser.push(_imageHash);
      idUserData[_address].imageNamesSharedWithUser.push(_imageName);
      idUserData[_address].usernameSharedWithUser.push(_usrName);
      idUserData[_address].addressSharedWithUser.push(msg.sender); 
      idUserData[_address].dateImageShareWithUser.push(_date);
    } 
    // return duplicateFound;
    //************** */ else alert user that it has already been shared with that user
  }

  function getSharedImageArr() public view returns (bytes32[] memory, bytes32[] memory, address[] memory, string[] memory, string[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].imageHashesSharedWithUser, idUserData[msg.sender].imageNamesSharedWithUser,
    idUserData[msg.sender].addressSharedWithUser, idUserData[msg.sender].usernameSharedWithUser, idUserData[msg.sender].dateImageShareWithUser); 
  }


    // set msg.sender [from who it was shared] 
  function shareFile(string memory _usrName, address _address, bytes32 _fileHash, bytes32 _fileName, string memory _date) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    // prevents duplicate files from being inserted (shared again)
    bool duplicateFound = false;
    for (uint i = 0; i < idUserData[_address].fileHashesSharedWithUser.length; i++) {
      if (idUserData[_address].fileHashesSharedWithUser[i] == _fileHash && idUserData[_address].fileAddressSharedWithUser[i] == msg.sender && idUserData[_address].fileNamesSharedWithUser == _fileName) {
        duplicateFound = true;
        break;
      }
    }
    if (!duplicateFound) {
      idUserData[_address].fileHashesSharedWithUser.push(_fileHash);
      idUserData[_address].fileNamesSharedWithUser.push(_fileName);
      idUserData[_address].fileUsernameSharedWithUser.push(_usrName);
      idUserData[_address].fileAddressSharedWithUser.push(msg.sender); 
      idUserData[_address].dateFileShareWithUser.push(_date);
    } 
    // return duplicateFound;
    //************** */ else alert user that it has already been shared with that user
  }

  function getSharedFileArr() public view returns (bytes32[] memory, bytes32[] memory, address[] memory, string[] memory, string[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].fileHashesSharedWithUser, idUserData[msg.sender].fileNamesSharedWithUser,
    idUserData[msg.sender].fileAddressSharedWithUser, idUserData[msg.sender].fileUsernameSharedWithUser, idUserData[msg.sender].dateFileShareWithUser); 
  }



  function set(bytes32 _imageHash, bytes32 _imageName, string memory _date) public { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    idUserData[msg.sender].imageHashes.push(_imageHash);
    idUserData[msg.sender].imageNames.push(_imageName); 
    idUserData[msg.sender].dateImageUpload.push(_date);
  }

  function setFile(bytes32 _fileHash, bytes32 _fileName, string memory _date) public { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    idUserData[msg.sender].fileHashes.push(_fileHash);
    idUserData[msg.sender].fileNames.push(_fileName);
    idUserData[msg.sender].dateFileUpload.push(_date);
  }

  function get() public view returns (bytes32[] memory, bytes32[] memory, string memory, string[] memory) {  // CATCH THE EXCEPTION: CALLER IS NOT A USER - HAPPENS WHEN GETS USERNAME 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].imageHashes, idUserData[msg.sender].imageNames, idUserData[msg.sender].username, idUserData[msg.sender].dateImageUpload); 
  }

  function getFile() public view returns (bytes32[] memory, bytes32[] memory, string memory, string[] memory) {  // CATCH THE EXCEPTION: CALLER IS NOT A USER - HAPPENS WHEN GETS USERNAME 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].fileHashes, idUserData[msg.sender].fileNames, idUserData[msg.sender].username, idUserData[msg.sender].dateFileUpload); 
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