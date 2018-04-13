// create all utility module in one class

// sha-256 encryption
const SHA256 = require('crypto-js/sha256');
// elliptic.ec class = creating public key
const EC = require('elliptic').ec;
// standard of efficient cryptographic :
const ec = new EC('secp256k1');
const uuidV1 = require('uuid/v1'); // v1 is one module base on timestamp, (should be others)

class ChainUtil {
    // generate key pair function from elliptic
    static genKeyPair() {
        return ec.genKeyPair();
    }
    // generate an unique id for tx
    static id() {
        return uuidV1();
    }
    // function to hash
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    // verifying signature (publicKey use for verification, signature to verify, dataHash = answer we want to find)
    static verifySignature(publicKey, signature, dataHash) {
        // ec has verify method return bool if verify is correct not:
        // input publickey, verify if signature & datahash is correct.
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}

module.exports = ChainUtil;