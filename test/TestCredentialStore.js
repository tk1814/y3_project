const { assert } = require("chai");
const CredStore = artifacts.require("CredentialStore");
const bs58 = require("bs58");
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

contract("Blockchain Credential Store tests", async accounts => {

  let instance;
  let image_hash_decoded = bs58.decode('QmSB3NM8EXHAPkxBcaD4Y9Mx8AbDfAaGYo9JK2nut6ziM8').slice(2);
  let image_hex_filename = web3.utils.asciiToHex('testImageName1')

  let file_hash_decoded = bs58.decode('QmahGZvmav1s65vR6HEiL9YU2VwfzEQKU4WKXu4jg9HjEW').slice(2);
  let file_hex_filename = web3.utils.asciiToHex('testFileName1')

  beforeEach(function () {
    return CredStore.new()
      .then(async (contractInstance) => {
        instance = contractInstance;

        await instance.signUpUserOrLogin('testUsername1', 'Thu Mar 11 2021 15:53:27 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] });
        await instance.signUpUserOrLogin('testUsername2', 'Thu Mar 12 2021 16:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[1] });

      });
  });

  it("Test: user sign up & login - grant user role and get usernames", async () => {
    let instance = await CredStore.deployed();

    let userSignUp = await instance.signUpUserOrLogin('testUsername1', 'Thu Mar 11 2021 15:53:27 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] });
    expectEvent(userSignUp, 'RoleGranted');

    let expected = JSON.stringify(['testUsername1']);
    let actual = JSON.stringify(await instance.getUsernames());
    assert.equal(actual, expected);

    await instance.signUpUserOrLogin('testUsername1', 'Thu Mar 13 2021 17:13:27 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] });

  });

  it("Test: new user accepted terms and conditions", async () => {

    let expected = JSON.stringify({ "0": [], "1": [], "2": "testUsername2", "3": [], "4": [], "5": [], "6": "Thu Mar 12 2021 16:23:37 GMT+0200 (Eastern European Standard Time)", "7": [] })
    let actual = JSON.stringify(await instance.getImages({ from: accounts[1] }));
    assert.equal(actual, expected);
  });

  describe("Reverting state - Access Cotrol", () => {

    it("Test: revert state when accessing images without permission", async () => {
      await expectRevert(instance.getImages({ from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when accessing files without permission", async () => {
      await expectRevert(instance.getFiles({ from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when accessing shared images without permission", async () => {
      await expectRevert(instance.getSharedImageArr({ from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when accessing shared files without permission", async () => {
      await expectRevert(instance.getSharedFileArr({ from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when sharing images without permission", async () => {
      await expectRevert(instance.shareImage('testUsername5', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when sharing files without permission", async () => {
      await expectRevert(instance.shareFile('testUsername5', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when uploading images without permission", async () => {
      await expectRevert(instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[5] }), 'Caller is not a user');
    });

    it("Test: revert state when uploading files without permission", async () => {
      await expectRevert(instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[5] }), 'Caller is not a user');
    });
  });

  describe("Store and Retrieve images and files", () => {

    it("Test: store and retrieve an image", async () => {

      await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] })

      let expected_image = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername1", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": [], "5": [], "6": "Thu Mar 11 2021 15:53:27 GMT+0200 (Eastern European Standard Time)", "7": [] })
      let actual_image = JSON.stringify(await instance.getImages());

      assert.equal(actual_image, expected_image);
    });

    it("Test: store and retrieve a file", async () => {

      await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] })

      let expected_file = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername1", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": [], "5": [], "6": [] });
      let actual_file = JSON.stringify(await instance.getFiles());

      assert.equal(actual_file, expected_file);
    });

  });

  describe("Share and retrieve shared images and files", () => {

    it("Test: share and retrieve a shared image", async () => {

      await instance.shareImage('testUsername1', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[0] })

      let expected_shared_image = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": [accounts[0]], "3": ["testUsername1"], "4": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "5": [true] })
      let actual_shared_image = JSON.stringify(await instance.getSharedImageArr({ from: accounts[1] }));

      assert.equal(actual_shared_image, expected_shared_image);
    });

    it("Test: share and retrieve a shared file", async () => {

      await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[0] })

      let expected_shared_file = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": [accounts[0]], "3": ["testUsername1"], "4": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "5": [true] })
      let actual_shared_file = JSON.stringify(await instance.getSharedFileArr({ from: accounts[1] }));

      assert.equal(actual_shared_file, expected_shared_file);
    });

  });

  describe("Retrieve images and files the user shared with other users", () => {

    it("Test: retrieve images the user shared with others", async () => {

      await instance.shareImage('testUsername1', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', false, { from: accounts[0] })

      let expected_shared_images = JSON.stringify({ "0": [], "1": [], "2": "testUsername1", "3": [], "4": [accounts[1]], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:53:27 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
      let actual_shared_images = JSON.stringify(await instance.getImages({ from: accounts[0] }));

      assert.equal(actual_shared_images, expected_shared_images);
    });

    it("Test: retrieve files the user shared with others", async () => {

      await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:26:27 GMT+0200 (Eastern European Standard Time)', false, { from: accounts[0] })

      let expected_shared_file = JSON.stringify({ "0": [], "1": [], "2": "testUsername1", "3": [], "4": [accounts[1]], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
      let actual_shared_files = JSON.stringify(await instance.getFiles({ from: accounts[0] }));

      assert.equal(actual_shared_files, expected_shared_file);
    });
  });
});