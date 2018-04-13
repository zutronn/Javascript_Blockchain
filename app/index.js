// core file build previously stored in 'blockchain' file, now we create an app:

// express application module:
const express = require('express');
// create new var "Blockchain", using class of 'blockchain' in : search ../blockchain class export previously
const Blockchain = require('../blockchain');

// bodyParser for reading POST request json from user send in HTTP: npm i body-parser --save
const bodyParser = require('body-parser');

// import the p2p server in app folder: (in the same file import, only use one . (away file import use ../)
const P2pServer = require('./p2p-server');

// create a wallet class for all users (from wallet index):
const Wallet = require('../wallet');

// the tx created from wallet is sending to a tx pool:
const TransactionPool = require('../wallet/transaction-pool');
// miner :
const Miner = require('./miner');

// create HTTP to run on localhost:3001 (or another HTTP if HTTP is in used)
const HTTP_PORT = process.env.HTTP_PORT || 3001;
// if 3001 is on used, eg. it will run 3002

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp); //file = ./p2p-server, class module = P2pServer
const miner = new Miner(bc, tp, wallet, p2pServer); //miner wallet

// CREATE : GET: localhost:3000/blocks where has request, respone json data
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});
// this is an api request of a GET function

// for Getting POST from user : (Remember code format):
app.use(bodyParser.json());

// Create : POST : /mine = POST request from user (POSTMAN : POST:BODY>RAW>JSON)
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    // everytime someone mine (create new longer chain), we sync all the chain (the
    p2pServer.syncChains();

    // after adding new block we redirect user back to the page /blocks (bc page):
    res.redirect('/blocks');
});

// test our transaction pool (is tx store in it)
app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

// create tx into tx pool POST method:
app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    // broadcast the tx to peers after create a tx:
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

// mine tx
app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');
});

// create a public key of yourself to see:
app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

// listen = create the localhost  ( ${var} = print variable content
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
// the listen runs here (listen to other port joining our network)
p2pServer.listen();

// Create another connection with different port : open another terminal, type:
// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
// connect the third one:
// HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

