// this JS combines other codes & got run by node:
// DELETED:
// ./block = refer to the block.js file we created (block class)
// GRAB THE CLASS HERE USE:
//const Block = require('./blockchain/block');

//test:
// Class Block (capital B), New object (lower case b)
// const block = new Block('foo','bar','zoo','baz');
//console.log(block.toString());

// print out genesis (with to string = print function):
//console.log(Block.genesis().toString());


// create a Block using : mineBlock() function created in block.js
// the last block is the genesis block (#2 block we are creating):
//const fooBlock = Block.mineBlock(Block.genesis(),'foo'); //(mineBlock(last hash,data)
//console.log(fooBlock.toString());

// * / mine 10 auto chain:
//const Blockchain = require('./blockchain');
//const bc = new Blockchain();
// create a for loop the loop 10x for creating 10 new blocks:
//for (let i=0; i<10; i++) {
    //console.log(bc.addBlock(`foo ${i}`).toString());}
// this test creating new blocks + difficulty adjust if fast / slow mine timestamp

// test create a wallet with Wallet class
const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());
