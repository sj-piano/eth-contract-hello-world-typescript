if (!process.env.IS_TS_NODE) {
  //tslint:disable-next-line:no-var-requires
  require('module-alias/register');
}

// Local imports
import * as ethereum from "#root/src/ethereum";

// Logging
let log2 = console.log;

// Run
const privateKey = ethereum.createPrivateKeySync();
ethereum.validatePrivateKeySync({ privateKey, name: 'foo' });
log2(privateKey);
