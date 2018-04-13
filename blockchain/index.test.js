const Blockchain = require('./index');
const Block = require('./block');

// test Blockchain class
describe('Blockchain', () => {
    // bc = blockchain, bc2 is used to valid the chain:
    let bc, bc2;

    beforeEach(() => {
        // everytime we create a new blockchain:
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('start the gensis block', () => {
        //test our chain[0] = genesis block:
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        //
        const data = 'foo';
        bc.addBlock(data);

        // test the data of last chain = the blockchain data, if yes, add a new block:
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
        // bc = blockchain class / .chain[# eg.10] /.data = 'data' in the last chain
    });

    // valid chain test :
    it('validates a valid chain', () => {
        // we needs to valid chain, so no bc = new Blockchain foreach() test:
        bc2.addBlock('foo');

        // because we have added a new block in bc2, we can do valiation : bc2 - bc
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    // invalid a chain => to be false when chain data is different ('foo'!=='bad data')
    it('invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'Bad data';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    // same invalid chain, but to the second block (chain[1])
    it('invalidates a courrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the chain with a valid chain', () => {
        // replace a block in the test chain:
        bc2.addBlock('goo');
        // bc replace by bc2 chain
        bc.replaceChain(bc2.chain);
        // after replace, the currenct bc chain should = bc2 test chain
        expect(bc.chain).toEqual(bc2.chain)
    });

    it('does not replace the chain with one of less than or equal to length.', () => {
        // add a new block to bc, so it is longer chain than bc2, and bc2 should not replace bc
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);
        // we expect shorter bc2 is not replacing the longer bc chain
        expect(bc.chain).not.toEqual(bc2.chain);
    });
});