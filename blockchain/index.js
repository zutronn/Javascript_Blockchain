// Create the structure of blockchain

//
const Block = require('./block');

// create blockchain class var : chain
class Blockchain {
    constructor() {
        // the blockchain starts with a genesis block
        this.chain = [Block.genesis()];
    }

    // Blockchain has a function to add block (data= 'foo'/tx data) :
    addBlock(data) {

        // * Block class has a function to create new block : called mineBlock
        // * Blockchain class function here: call the mineBlock func & link the chain together : called addBlock(what we do here):
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        // last block = this.chain.length-1 /(eg.last blockchain[10] when we are at chain 11 (11-1=10))

        // JS function : push the block to the chain:
        this.chain.push(block);

        return block;
    }

    // valid block'chain', if people chain not same, all substitute the longest chain:
    isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        // run a for loop to valid for every single block:
        for (let i=1; i<chain.length; i++) {
            // i = 1,2,3,4.... to the current block
            const block = chain[i];
            const lastBlock = chain[i-1];
            // if the lastblock 'hash' not = currentblock 'lasthash'
            // OR if cuurent Block 'hash' of test chain not = our Block.blockhash func:
            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }
        // return true if both above test passes.
        return true;
    }
        // if the chain is invalid, replace chain with longest chain:
    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the currenct chain.');
            // return the original chain if substitute chain is not longer
            return;
            // if the chain is not actual valid :
        } else if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid.');
            return;
        }

        // If both above statement is not true, newchain length > current, replace.
        console.log('Replacing blockchain with the new chain.');
        // our chain substitute with newchain:
        this.chain = newChain;
    }
}

module.exports = Blockchain;