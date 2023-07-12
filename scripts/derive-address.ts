// Imports
import fs from "fs";

// Local imports
import ethereum from "#src/ethereum";

// Logging
const log2 = console.log;

// Read stdin
const pipedString = fs.readFileSync(process.stdin.fd).toString().trim();

// Parse arguments
const privateKey = pipedString;

// Run
const address = ethereum.deriveAddressSync({ privateKey });
ethereum.validateAddressSync({ address });
log2(address);
