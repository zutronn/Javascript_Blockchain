// import websocket module: Section 5
const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
// contains a list of socket address : (eg. ws://localhost:5001, ws://localhost:5002..)
// HTTP_PORT = 3001, P2P_PORT = 5003 PEERS=ws://localhost:5001,5002... npm run dev

// return a array[, , ,] of all P2P socket linked to our server:
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

// create new tx broadcast use send over socket to peers:
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
    // recall __init__ = constructor
    // blockchain will be replaced by bc (blockchain var) when use)
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        // the sockets all into the array []
        this.sockets = [];
    }

    listen() {
        // var = Websocker server (module used)
        const server = new Websocket.Server({ port: P2P_PORT });
        //listening to the socket, and send to the server any incoming connection:
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        // print out we have a connection from IP : P2P_PORT
        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
           // peer looks like ws://localhost:5001 (every peers is an object socket
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    // once we detect socket, we push to our sockets[] variable above
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket);
        // when the new socket connect, we print them the chain
        this.sendChain(socket);
    }
    // session 27: (new connector will receive server 5001 blockchain, server 5001 will receive new connector blockchain
    messageHandler(socket) {
        socket.on('message', message => {
            // change the json object to a JS object store in 'data':
            const data = JSON.parse(message);

            switch(data.type) {
                // adjust MESSAGE_TYPE
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
                    //create function to the node bc stuff (substitute with new bc when new blocks mined)
            }
        });
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify( { type: MESSAGE_TYPES.transaction,
            transaction }));
    }

    sendChain(socket) {
        // tell all socket we have a new socket connectioning us!
        socket.send(JSON.stringify( { type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain }));
    }
    // test : postman 3001 POST /mine, 3002 GET /blocks should have same bc.
    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
    // broadcast when we create a tx & in to the tx pool
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPE.clear_transactions
        })));
    }
}
// export the p2p server
module.exports = P2pServer;