// standard DIFFICULTY, +/- 1 with the block mine time fast / slow:
const DIFFICULTY = 4;
// Mining adjustment : 3000 millisecond = 3 second
const MINE_RATE = 3000;
// wallet initial balance:
const INITIAL_BALANCE = 500;
const MINING_REWARD = 50;

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD };