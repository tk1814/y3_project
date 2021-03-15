// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.6.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CredentialStore is Ownable, AccessControl {

  bytes32 private constant USER_ROLE = keccak256("USER_ROLE");

  struct userData {

    bool userExists; 
    string acceptTermsConditionsDate; 
    string username;
    bool[] viewOnlyImage;
    bool[] viewOnlyFile;

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

    address[] imageAddressSharedWithUser;
    address[] fileAddressSharedWithUser;
    string[] imageUsernameSharedWithUser;
    string[] fileUsernameSharedWithUser;

    string[] dateImageSharedWithUser;
    string[] dateFileSharedWithUser;

    address[] imageAddressUserSharedWith;
    bytes32[] imageHashUserSharedWith;
    bytes32[] imageNamesUserSharedWith;

    address[] fileAddressUserSharedWith;
    bytes32[] fileHashUserSharedWith;
    bytes32[] fileNamesUserSharedWith;
  }

  mapping (address => userData) private idUserData;

  string[] private allUsernames;

  function signUpUserOrLogin(string memory _usr, string memory _date) public { 

    if (!idUserData[msg.sender].userExists) {
      idUserData[msg.sender].userExists = true;
      idUserData[msg.sender].username = _usr;
      idUserData[msg.sender].acceptTermsConditionsDate = _date;
      allUsernames.push(_usr);
      _setupRole(USER_ROLE, msg.sender);
    } // else user already exists
  }

  function getUsernames() public view returns (string[] memory) {  
    return (allUsernames); 
  }

  function shareImage(string memory _usrName, address _address, bytes32 _imageHash, bytes32 _imageName, string memory _date, bool _viewOnly) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    idUserData[_address].imageHashesSharedWithUser.push(_imageHash);
    idUserData[_address].imageNamesSharedWithUser.push(_imageName);
    idUserData[_address].imageUsernameSharedWithUser.push(_usrName);
    idUserData[_address].imageAddressSharedWithUser.push(msg.sender); 
    idUserData[_address].dateImageSharedWithUser.push(_date);

    idUserData[msg.sender].imageAddressUserSharedWith.push(_address);
    idUserData[msg.sender].imageHashUserSharedWith.push(_imageHash);
    idUserData[msg.sender].imageNamesUserSharedWith.push(_imageName); 
    idUserData[_address].viewOnlyImage.push(_viewOnly);
  }

  function getSharedImageArr() public view returns (bytes32[] memory, bytes32[] memory, address[] memory, string[] memory, string[] memory, bool[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    return (idUserData[msg.sender].imageHashesSharedWithUser, idUserData[msg.sender].imageNamesSharedWithUser, idUserData[msg.sender].imageAddressSharedWithUser, 
    idUserData[msg.sender].imageUsernameSharedWithUser, idUserData[msg.sender].dateImageSharedWithUser, idUserData[msg.sender].viewOnlyImage); 
  }

  function shareFile(string memory _usrName, address _address, bytes32 _fileHash, bytes32 _fileName, string memory _date, bool _viewOnly) public {
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    idUserData[_address].fileHashesSharedWithUser.push(_fileHash);
    idUserData[_address].fileNamesSharedWithUser.push(_fileName);
    idUserData[_address].fileUsernameSharedWithUser.push(_usrName);
    idUserData[_address].fileAddressSharedWithUser.push(msg.sender); 
    idUserData[_address].dateFileSharedWithUser.push(_date);

    idUserData[msg.sender].fileAddressUserSharedWith.push(_address);
    idUserData[msg.sender].fileHashUserSharedWith.push(_fileHash);
    idUserData[msg.sender].fileNamesUserSharedWith.push(_fileName); 
    idUserData[_address].viewOnlyFile.push(_viewOnly);
  }

  function getSharedFileArr() public view returns (bytes32[] memory, bytes32[] memory, address[] memory, string[] memory, string[] memory, bool[] memory) { 
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    return (idUserData[msg.sender].fileHashesSharedWithUser, idUserData[msg.sender].fileNamesSharedWithUser, idUserData[msg.sender].fileAddressSharedWithUser, 
    idUserData[msg.sender].fileUsernameSharedWithUser, idUserData[msg.sender].dateFileSharedWithUser, idUserData[msg.sender].viewOnlyFile); 
  }

  function setImage(bytes32 _imageHash, bytes32 _imageName, string memory _date) public { 
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

  function getImages() public view returns (bytes32[] memory, bytes32[] memory, string memory, string[] memory, address[] memory, bytes32[] memory, string memory, bytes32[] memory) {  
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    return (idUserData[msg.sender].imageHashes, idUserData[msg.sender].imageNames, idUserData[msg.sender].username, idUserData[msg.sender].dateImageUpload,
    idUserData[msg.sender].imageAddressUserSharedWith, idUserData[msg.sender].imageHashUserSharedWith, idUserData[msg.sender].acceptTermsConditionsDate, idUserData[msg.sender].imageNamesUserSharedWith); 
  }

  function getFiles() public view returns (bytes32[] memory, bytes32[] memory, string memory, string[] memory, address[] memory, bytes32[] memory, bytes32[] memory) {   
    require(hasRole(USER_ROLE, msg.sender), "Caller is not a user");

    return (idUserData[msg.sender].fileHashes, idUserData[msg.sender].fileNames, idUserData[msg.sender].username, idUserData[msg.sender].dateFileUpload,
    idUserData[msg.sender].fileAddressUserSharedWith, idUserData[msg.sender].fileHashUserSharedWith, idUserData[msg.sender].fileNamesUserSharedWith); 
  }
  
}