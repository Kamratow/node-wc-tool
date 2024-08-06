#!/usr/bin/env node
import fs from "node:fs/promises";

// we get third argument here as first one would be 'node' and the second one the script file we run
function main(): void {
  const args = process.argv.slice(2);
  const wcArg = args[0];
  const filePath = args[1];

  if (wcArg == "-c") {
    showFileBytes(filePath);
  }
}

async function showFileBytes(filePath: string): Promise<void> {
  console.log("Reading file...");

  const fileBytes = await countBytes(filePath);

  if (fileBytes) {
    console.log(`${fileBytes} ${filePath}`);
  }
}

async function countBytes(filePath: string): Promise<number | null> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (e) {
    console.log(e);
    return null;
  }
}

main();
