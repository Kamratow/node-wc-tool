#!/usr/bin/env node
import fs from "node:fs/promises";
import readline from "node:readline";
import syncFs from "node:fs";

// we get third argument here as first one would be 'node' and the second one the script file we run
function main(): void {
  const args = process.argv.slice(2);
  const wcArg = args[0];
  const filePath = args[1];

  if (wcArg == "-c") {
    showFileBytes(filePath);
  }

  switch (wcArg) {
    case "-c":
      showFileBytes(filePath);
      break;
    case "-l":
      showFileLinesCount(filePath);
      break;
    case "-w":
      showFileWordCount(filePath);
      break;
    case "-m":
      showFileCharCount(filePath);
      break;
    default:
      showAllFileStats(args[0]);
      break;
  }
}

async function showFileBytes(filePath: string): Promise<void> {
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

async function showFileLinesCount(filePath: string): Promise<void> {
  const lineCount = await countLines(filePath);

  if (lineCount) {
    console.log(`${lineCount} ${filePath}`);
  }
}

async function countLines(filePath: string): Promise<number | null> {
  try {
    const fileStream = syncFs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;

    for await (const _ of rl) {
      lineCount++;
    }

    return lineCount;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function showFileWordCount(filePath: string): Promise<void> {
  const wordCount = await countWords(filePath);

  if (wordCount) {
    console.log(`${wordCount} ${filePath}`);
  }
}

async function countWords(filePath: string): Promise<number | null> {
  try {
    const fileStream = syncFs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let wordCount = 0;

    for await (const line of rl) {
      wordCount += line
        .split(/\s/)
        .filter((singleWord) => singleWord != "").length;
    }

    return wordCount;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function showFileCharCount(filePath: string): Promise<void> {
  const charCount = await countChar(filePath);

  if (charCount) {
    console.log(`${charCount} ${filePath}`);
  }
}

async function countChar(filePath: string): Promise<number | null> {
  try {
    return (await fs.readFile(filePath)).toString().length;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function showAllFileStats(filePath: string): Promise<void> {
  const fileBytes = await countBytes(filePath);
  const lineCount = await countLines(filePath);
  const wordCount = await countWords(filePath);

  if (fileBytes) {
    console.log(`${lineCount} ${wordCount} ${fileBytes} ${filePath}`);
  }
}

main();
