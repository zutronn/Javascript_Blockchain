const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
    constructor() {
        // each tx has an unique id
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    // update the tx and sender new balance after tx is made:
    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address ===
    senderWallet.publicKey);
        // if amount exceed, do not record.
        if(amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        // sender has sent tx has a new balance, push to the [outputs] var
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    static transactionWithOutputs(senderWallet, outputs) {
        // create tx var that = the Transaction class (this())
        const transaction = new this();
        transaction.outputs.push(...outputs);
        // the tx create above on blockchain, will also create a signtx from senderwallet:
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount) {
        // if amount > balance, print it and exit the tx function
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet, [
                { amount : senderWallet.balance - amount, address: senderWallet.publicKey },
                    { amount, address: recipient}
        ]);
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        // bc wallet valid the tx and approve rewards to miner (miner cant decide approve reward)
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        // a sign tx will create a transaction with a time, in the senderwallet
        transaction.input = {
            timestamp: Date.now(),
            // balance? not senderWallet.amount?
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            //hash the sign output before showing
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))

        }
    }
    // verify transaction using ChainUtil (ec) verifySignature function:
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
          transaction.input.address,
          transaction.input.signature,
          ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;