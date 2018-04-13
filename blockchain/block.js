const ChainUtil = require('../chain-util');
// grab difficulty variable (this convenient us to import difficulty in testing file too)
const { DIFFICULTY, MINE_RATE } =require('../config');

class Block {
    // Block has the following __init__ parameters
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        // difficulty = difficulty or in the configuration file if not mention:
        this.difficulty = difficulty || DIFFICULTY;
    }

    // function to prints the block on console.log:
    toString() {
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0.10)}
        Hash      : ${this.hash.substring(0,10)}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}
        Data      : ${this.data}`;
    }

    // Create genesis block (static = do not need to create an instance, it is one when created)
    static genesis() {
        // create dumbie timestamp, lasthash, hash, data[], nonce=0
        return new this('Genesis time', '-----', 'f1r57-h45h', [], 0);
    }

    // Create new blocks function, base on the last block and it contains data
    static mineBlock(lastBlock, data) {
        // create a var hash for guessing the none & hash change, to fit 00000... correct hash
        // this is like hash = [] in python:
        let hash, timestamp;

        // last hash = last Block's current hash
        const lastHash = lastBlock.hash;

        // difficulty = last block difficulty
        let { difficulty } = lastBlock;

        // ** MINING : CHANGE NONCE VALUE GUESS:
        let nonce = 0;

        do {
            nonce++;
            // timestamp = JS date module, every loop has different time, hence different timestamp var
            timestamp = Date.now();
            // adjust the difficulty in every loop:
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            // Current Hash = below hash function that input timestamp+lastHash+data =>output
            // & becomes the "Block.hash" (see above):
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
            // * UP TO DIFFICULT = 6 define above 000000 before loop breaks.
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        // only the while loops break if the hash is found.

        // when the guess is right, new block is mined, return new Date, new last block hash & hash
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);

    }
    // the current hash is timestamp+lastHash+data => SHA256 => 32byte output
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        // return the SHA256 of the timestamp+lastHash+data HASHED.
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }
    // ?
    static blockHash(block) {
        // Do the hash function if : ?
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }
    // if we mine block time is low, increase difficulty, vice versa.
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        // difficulty = last block difficulty time + (IF Mine rate > currenttime test)
        // if YES, difficulty + 1, vv, difficulty - 1
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

// export the class Block:
module.exports = Block;