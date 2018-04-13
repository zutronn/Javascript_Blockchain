
//create a test block :
const Block = require('./block');

// Create test for Block class
describe('Block', () => {
    let data, lastBlock, block;
    // ?
    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    // test block data = input data
    it('sets the `data` to match the input', () => {
        // we except block data = data input
        expect(block.data).toEqual(data);
    });


    // 2nd test : `lasthash` (validation)  = last block hash
    it('set the `lastHash` to match the hash of the last block', () => {
        // we expect block last hash = last hash input
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
    // test if the mining guess the right hash : *
    it('genereates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });
    // test if the difficulty -1 for slow mine block timestamp (>3600 second = slow)
    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty-1)
    });
    // test if the difficulty +1 for fast mine block timestamp
    it('raises the difficulty for quickly mine blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1)
    });
});