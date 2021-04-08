const { assert } = require("chai");
const CredStore = artifacts.require("CredentialStore");
const bs58 = require("bs58");

contract("Blockchain Credential Store tests with multiple users", async accounts => {

  let instance;
  let image_hash_decoded = bs58.decode('QmSB3NM8EXHAPkxBcaD4Y9Mx8AbDfAaGYo9JK2nut6ziM8').slice(2);
  let image_hex_filename = web3.utils.asciiToHex('testImageName1')

  let file_hash_decoded = bs58.decode('QmahGZvmav1s65vR6HEiL9YU2VwfzEQKU4WKXu4jg9HjEW').slice(2);
  let file_hex_filename = web3.utils.asciiToHex('testFileName1')

  beforeEach(function () {
    return CredStore.new()
      .then(async (contractInstance) => {
        instance = contractInstance;

        await instance.signUpUserOrLogin('testUsername1', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] });
        await instance.signUpUserOrLogin('testUsername2', 'Thu Mar 12 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[1] });

      });
  });

  it("Test: multiple users sign up - login - upload - share", async () => {
    let instance = await CredStore.deployed();

    await instance.signUpUserOrLogin('testUsername1', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] });
    await instance.signUpUserOrLogin('testUsername2', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[1] });
    await instance.signUpUserOrLogin('testUsername3', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[2] });
    await instance.signUpUserOrLogin('testUsername4', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[3] });
    await instance.signUpUserOrLogin('testUsername5', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[4] });
    await instance.signUpUserOrLogin('testUsername6', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[5] });
    await instance.signUpUserOrLogin('testUsername7', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[6] });
    await instance.signUpUserOrLogin('testUsername8', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[7] });
    await instance.signUpUserOrLogin('testUsername9', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[8] });
    await instance.signUpUserOrLogin('testUsername0', 'Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)', { from: accounts[9] });

    let expected_usernames = JSON.stringify(["testUsername1", "testUsername2", "testUsername3", "testUsername4", "testUsername5", "testUsername6", "testUsername7", "testUsername8", "testUsername9", "testUsername0"]);
    assert.equal(JSON.stringify(await instance.getUsernames()), expected_usernames);

    await instance.shareImage('testUsername1', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[0] })
    await instance.shareImage('testUsername2', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[1] })
    await instance.shareImage('testUsername3', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[2] })
    await instance.shareImage('testUsername4', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[3] })
    await instance.shareImage('testUsername5', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[4] })
    await instance.shareImage('testUsername6', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[5] })
    await instance.shareImage('testUsername7', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[6] })
    await instance.shareImage('testUsername8', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[7] })
    await instance.shareImage('testUsername9', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[8] })
    await instance.shareImage('testUsername0', accounts[1], image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[9] })

    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[0] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[1] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[2] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[3] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[4] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[5] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[6] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[7] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[8] })
    await instance.shareFile('testUsername1', accounts[1], file_hash_decoded, file_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', true, { from: accounts[9] })

    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[1] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[2] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[3] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[4] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[5] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[6] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[7] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[8] })
    await instance.setImage(image_hash_decoded, image_hex_filename, 'Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)', { from: accounts[9] })

    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[0] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[1] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[2] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[3] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[4] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[5] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[6] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[7] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[8] })
    await instance.setFile(file_hash_decoded, file_hex_filename, 'Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)', { from: accounts[9] })

    let expected_image0 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername1", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image1 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername2", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image2 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername3", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image3 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername4", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image4 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername5", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image5 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername6", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image6 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername7", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image7 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername8", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image8 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername9", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })
    let expected_image9 = JSON.stringify({ "0": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "1": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"], "2": "testUsername0", "3": ["Thu Mar 12 2021 14:56:28 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0x38f88f838cc13b915ddd8a9573c034a303bc7c32f03b007766f2233f06c778eb"], "6": "Thu Mar 11 2021 15:23:37 GMT+0200 (Eastern European Standard Time)", "7": ["0x74657374496d6167654e616d6531000000000000000000000000000000000000"] })

    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[0] })), expected_image0);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[1] })), expected_image1);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[2] })), expected_image2);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[3] })), expected_image3);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[4] })), expected_image4);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[5] })), expected_image5);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[6] })), expected_image6);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[7] })), expected_image7);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[8] })), expected_image8);
    assert.equal(JSON.stringify(await instance.getImages({ from: accounts[9] })), expected_image9);

    let expected_file0 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername1", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file1 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername2", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file2 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername3", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file3 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername4", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file4 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername5", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file5 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername6", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file6 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername7", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file7 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername8", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file8 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername9", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })
    let expected_file9 = JSON.stringify({ "0": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "1": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"], "2": "testUsername0", "3": ["Thu Mar 13 2021 16:16:38 GMT+0200 (Eastern European Standard Time)"], "4": ["0x7F10b51CF6138A01C069D3E9e31Be67935C62810"], "5": ["0xb79467ba150720b5139ecefb6eb82541f8ccae0ded2b5aa25c5153254a76c757"], "6": ["0x7465737446696c654e616d653100000000000000000000000000000000000000"] })

    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[0] })), expected_file0);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[1] })), expected_file1);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[2] })), expected_file2);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[3] })), expected_file3);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[4] })), expected_file4);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[5] })), expected_file5);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[6] })), expected_file6);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[7] })), expected_file7);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[8] })), expected_file8);
    assert.equal(JSON.stringify(await instance.getFiles({ from: accounts[9] })), expected_file9);

  });
});