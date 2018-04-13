const Transaction = require('../wallet/transaction');

class TransactionPool {
    constructor() {
        // gather tx into tx pool
        this.transactions = [];
    }
    // update if have same tx id, Add push if no that tx id the pool:
    updateOrAddTransaction(transaction) {
        // check if incoming tx already exist in the pool, using find():
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        // if statement of above question (bool)
        if (transactionWithId) {
            // if already has txid in the pool, update it with the new one:
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            // if tx is not in the pool, we push the tx in the pool:
            this.transactions.push(transaction);
        }
    }
    // a test if there is any existing tx in the pool, return yes or undefined.
    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions() {
        // check if tx is valid
        return this.transactions.filter(transaction => {
            // calculate the total ouput amount
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0); // start counting from 0

            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${transaction.input.address}.`);
                return;
            }

            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}.`);
                return;
            }
            // if all ok, return transaction
            return transaction;
        });
    }

    clear() {
        this.transactions = [];
    }
}

module.exports = TransactionPool;