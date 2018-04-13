const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

// create tx pool test, pre set tp (tx pool) / wallet / tx var
describe('TransactionPool', () => {
    // tp, wallet, transaction = []
   let tp, wallet, transaction, bc;

   // default setting for the below 'it' test:
   beforeEach(() => {
      tp = new TransactionPool();
      wallet = new Wallet();
      bc = new Blockchain();
      transaction = wallet.createTransaction('rdnd-4drr355', 30, bc, tp);
   });

   it('adds a transaction to the pool', () => {
      expect(tp.transactions.find(t => t.id === transaction.id))
.toEqual(transaction);
   });

   // test if it updates a tx if have same id tx in the pool
   it('updates a transaction in the pool', () => {
       const oldTransaction = JSON.stringify(transaction);
       const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
       // runs the below function with the newTransaction var
       tp.updateOrAddTransaction(newTransaction);

       // we should except the tx in tx pool (with same id) not == old tx anymore
       expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
.not.toEqual(oldTransaction);
   });

   it('clear transactions', () => {
      tp.clear();
      expect(tp.transactions).toEqual([]);
   });

   describe('mixing valid and corrupt transactions', () => {
      // create valid tx & one unvalid tx:
      let validTransactions;

      beforeEach(() => {
         validTransactions = [...tp.transactions];
         for (let i=0; i<6; i++) {
             wallet = new Wallet();
             transaction = wallet.createTransaction('rdnd-4drr355', 30, bc, tp);
            if (i%2==0) {
                //create fake stuff:
                transaction.input.amount = 99999;
            } else {
                validTransactions.push(transaction);
            }
         }
      });

      it('shows a difference between valid and corrupt transaction', () => {
         expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
      });

      it('grabs valid transactions', () => {
          expect(tp.validTransactions()).toEqual(validTransactions);
      });
   });
});