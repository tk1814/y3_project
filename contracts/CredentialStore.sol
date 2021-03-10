// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.6.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CredentialStore is Ownable, AccessControl {

  bytes32 public constant USER_ROLE = keccak256("USER_ROLE"); //  enum State { Created, Locked, Inactive }
  string[] allUsernames;
  // array of structs // 0 default 
  struct userData {

    bool userExists; 
    string acceptTermsConditionsDate; 
    string username;
    bool[] viewOnlyImage;
    bool[] viewOnlyFile;
    // int256 newlySharedItems;
    // if user does getSharedFileArr & getSharedImageArr means that user logged in and is in sharepoint 

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

    // new: user shared files with:
    address[] imageAddressUserSharedWith;
    bytes32[] imageHashUserSharedWith;

    address[] fileAddressUserSharedWith;
    bytes32[] fileHashUserSharedWith;

  }

  mapping (address => userData) idUserData;

  // onlyOwner fun that add users 
  
  bytes32[] initArr;
  bytes32[] initArrShared;
  
  function signUpUserOrLogin(string memory _usr, string memory _date) public { // onlyOwner { acc2 can connect, acc3,4 cannot }
    // owner = msg.sender;
    if (!idUserData[msg.sender].userExists) {
      idUserData[msg.sender].userExists = true;
      idUserData[msg.sender].username = _usr;
      idUserData[msg.sender].acceptTermsConditionsDate = _date;
      allUsernames.push(_usr);
      _setupRole(USER_ROLE, msg.sender);
      // idUserData[msg.sender].imageHashes = initArr;
      // idUserData[msg.sender].imageNames = initArr;
      // idUserData[msg.sender].fileHashes = initArr;
      // idUserData[msg.sender].fileNames = initArr;
      // check why do that******** Sign up problem
      // idUserData[msg.sender].imageHashesSharedWithUser;// = initArrShared;
      // idUserData[msg.sender].imageNamesSharedWithUser; 
      // idUserData[msg.sender].fileHashesSharedWithUser;// = initArrShared;
      // idUserData[msg.sender].fileNamesSharedWithUser; 
      // idUserData[msg.sender].addressSharedWithUser;
      // idUserData[msg.sender].usernameSharedWithUser;
      // idUserData[msg.sender].fileAddressSharedWithUser;   
      // idUserData[msg.sender].fileUsernameSharedWithUser;  
    } // else user already exists
  }

  function getUsernames() public view returns (string[] memory) {  
    // require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (allUsernames); 
  }

  function shareImage(string memory _usrName, address _address, bytes32 _imageHash, bytes32 _imageName, string memory _date, bool _viewOnly) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

      idUserData[_address].imageHashesSharedWithUser.push(_imageHash);
      idUserData[_address].imageNamesSharedWithUser.push(_imageName);
      idUserData[_address].usernameSharedWithUser.push(_usrName);
      idUserData[_address].addressSharedWithUser.push(msg.sender); 
      idUserData[_address].dateImageShareWithUser.push(_date);

      // new: User shared a file//image with the following address - viewOnly option
      idUserData[msg.sender].imageAddressUserSharedWith.push(_address);
      idUserData[msg.sender].imageHashUserSharedWith.push(_imageHash);
      idUserData[_address].viewOnlyImage.push(_viewOnly);
    // }   
  }

  function getSharedImageArr() public view returns (bytes32[] memory, bytes32[] memory, address[] memory, string[] memory, string[] memory, bool[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].imageHashesSharedWithUser, idUserData[msg.sender].imageNamesSharedWithUser,
    idUserData[msg.sender].addressSharedWithUser, idUserData[msg.sender].usernameSharedWithUser, idUserData[msg.sender].dateImageShareWithUser,
    idUserData[msg.sender].viewOnlyImage); 
  }

  function shareFile(string memory _usrName, address _address, bytes32 _fileHash, bytes32 _fileName, string memory _date, bool _viewOnly) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

      idUserData[_address].fileHashesSharedWithUser.push(_fileHash);
      idUserData[_address].fileNamesSharedWithUser.push(_fileName);
      idUserData[_address].fileUsernameSharedWithUser.push(_usrName);
      idUserData[_address].fileAddressSharedWithUser.push(msg.sender); 
      idUserData[_address].dateFileShareWithUser.push(_date);

      // new: User shared a file//image with the following address - viewOnly option
      idUserData[msg.sender].fileAddressUserSharedWith.push(_address);
      idUserData[msg.sender].fileHashUserSharedWith.push(_fileHash);
      idUserData[_address].viewOnlyFile.push(_viewOnly);
    // } 
  }

  function getSharedFileArr() public view returns (bytes32[] memory, bytes32[] memory, address[] memory, string[] memory, string[] memory, bool[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].fileHashesSharedWithUser, idUserData[msg.sender].fileNamesSharedWithUser,
    idUserData[msg.sender].fileAddressSharedWithUser, idUserData[msg.sender].fileUsernameSharedWithUser, idUserData[msg.sender].dateFileShareWithUser,
    idUserData[msg.sender].viewOnlyFile); 
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

  // CATCH THE EXCEPTION: CALLER IS NOT A USER - HAPPENS WHEN GETS USERNAME 
  function get() public view returns (bytes32[] memory, bytes32[] memory, string memory, string[] memory, address[] memory, bytes32[] memory, string memory) {  
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].imageHashes, idUserData[msg.sender].imageNames, idUserData[msg.sender].username, idUserData[msg.sender].dateImageUpload,
    idUserData[msg.sender].imageAddressUserSharedWith, idUserData[msg.sender].imageHashUserSharedWith, idUserData[msg.sender].acceptTermsConditionsDate); 
  }

  function getFile() public view returns (bytes32[] memory, bytes32[] memory, string memory, string[] memory, address[] memory, bytes32[] memory) {  // CATCH THE EXCEPTION: CALLER IS NOT A USER - HAPPENS WHEN GETS USERNAME 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");
    return (idUserData[msg.sender].fileHashes, idUserData[msg.sender].fileNames, idUserData[msg.sender].username, idUserData[msg.sender].dateFileUpload,
    idUserData[msg.sender].fileAddressUserSharedWith, idUserData[msg.sender].fileHashUserSharedWith); 
  }

  // bytes32[] public imageHashes;
  // function set(bytes32 _imageHash) public { // abstract 0.7.0
  //   imageHashes.push(_imageHash);
  // }

  // function get() public view returns (bytes32[] memory) { //internal dw
  //   return imageHashes;
  // }
}