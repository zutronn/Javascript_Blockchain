const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

// test transaction:
describe('Transaction', () => {
   let transaction, wallet, recipient, amount;

   beforeEach(() => {
      wallet = new Wallet();
      amount = 50;
      recipient = 'r3c1p13nt';
      transaction = Transaction.newTransaction(wallet, recipient, amount);
   });
   // test if the amount is send correctly from sender wallet to recipient
   it('outputs the `amount` subtracted from the wallet balance', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
.toEqual(wallet.balance - amount);
   });

   it('outputs the `amount` added to the recipient', () => {
       expect(transaction.outputs.find(output => output.address === recipient).amount)
.toEqual(amount);
   });

   // test if the sender wallet balance = tx show sender balance
   it('inputs the balance of the wallet', () => {
      expect(transaction.input.amount).toEqual(wallet.balance);
   });

   // test the ec verifySignature function returns bool = true:
   it('validates a valid transaction', () => {
      expect(Transaction.verifyTransaction(transaction)).toBe(true);
   });

   // test if the ec verifySignature finds a corrupt tx : verify = false
   it('invalidates a corrupt transaction', () => {
      // expect a random wallet balance = 50000 which must be false:
      transaction.outputs[0].amount = 50000;
      expect(Transaction.verifyTransaction(transaction)).toBe(false);
   });

   // test to expect if amount > balance, it returns undefined.
   describe('transaction with an amount that exceeds the balance', () => {
      beforeEach(() => {
         amount = 50000;
         transaction = Transaction.newTransaction(wallet, recipient, amount);
});
   it('does not create the transaction', () => {
      expect(transaction).toEqual(undefined);
   });
   });

   // test of updating tx after sender sent:
   describe('and updating a transaction', () => {
      let nextAmount, nextRecipient;

      beforeEach(() => {
         nextAmount = 20;
         nextRecipient = 'n3xt-4ddr355';
         transaction = transaction.update(wallet, nextRecipient, nextAmount);
      });
      // test if the sender new balance is substract the sent amount (bal updated)
      it(`substracts the next amount from the sender's output`, () => {
         // .find function to find the output address bal amount = wallet.bal - amount
         expect(transaction.outputs.find(output => output.address
=== wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
      });

      //
      it('outputs an amount for the next recipient', () => {
         expect(transaction.outputs.find(output => output.address
=== nextRecipient).amount).toEqual(nextAmount);
      });

   });

   describe('creating a reward transaction', () => {
      beforeEach(() => {
          transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
});
      it(`reward the miner's wallet`, () => {
          expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
.toEqual(MINING_REWARD);
      });
   });
});