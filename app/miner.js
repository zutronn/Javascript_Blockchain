const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner { //wallet and p2pServer for the miner
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    // create the action mine : gather tx into block, mine, return valid + reward to miner
    mine() {
        const validTransactions = this.transactionPool.validTransactions();//can code like this?
        // 1) valid tx by reward the blockchain approve wallet to miner wallet:
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
        );
        // 2) create a block consisting of the valid tx
        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChains();
        // 3) synchronize the chains in the p2p server
        // clear the tx pool using transactionPool function.clear()
        this.transactionPool.clear();
        // 4) clear the tx pool
        // 5) broadcast to every miner to clear thier tx pool (update bc)

        return block;
    }
}

module.exports = Miner;