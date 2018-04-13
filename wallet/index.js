const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair(); //use the genkeypair function created
        // the public key .getPublic the above key pair + encode it.
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -    
            publicKey: ${this.publicKey.toString()} 
            balance  : ${this.balance}`
    }
    // signing a tx takes input of the datahash (yellow sign = a ec in built func)
    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        //after define below createBalance():
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return; // return : stops the function here.
        }
        // transaction = a test if the tx is already in the tp
        let transaction = transactionPool.existingTransaction(this.publicKey);
        // if transaction = alreay has exist tx in the tp, update
        if (transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
            // if our new tx  has no same id in the tp, it is a new tx, push to tp
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];
        // run a loop of blocks>tx and see if they have our wallet
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));

        // wallet input tx
        const walletInputTs = transactions
            .filter(transaction => transaction.input.address === this.publicKey);

        let startTime = 0;

        // check timestamp first
        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            // balance =
            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
            //add up amount the output from starttime
        }
        // add up when we see things in blocks
        transactions.forEach(transaction => {
           if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
            }
                });
            }
        });

        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this(); //this>wallet class
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;