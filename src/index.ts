#!/usr/bin/env node

// we get third argument here as first one would be 'node' and the second one the script file we run
function main(): void {
  const args = process.argv.slice(2);

  const wcArgument = args[0];

  if (wcArgument == "-c") {
    countBytes();
  }
}

function countBytes(): void {
  console.log("we are logging bytes");
}

main();
