// Local imports
const ethereum = require("#root/src/ethereum.js");

// Logging
let log = console.log;

// Run
const privateKey = ethereum.createPrivateKeySync();
ethereum.validatePrivateKeySync({ privateKey });
log(privateKey);
