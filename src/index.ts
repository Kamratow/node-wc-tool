#!/usr/bin/env node
import fs from "node:fs/promises";
import readline from "node:readline";
import syncFs from "node:fs";

// we get third argument here as first one would be 'node' and the second one the script file we run
function main(): void {
  const isFilePathProvided = process.argv.length >= 4;

  const args = process.argv.slice(2);
  const wcArg = args[0];
  const filePath = isFilePathProvided ? args[1] : null;

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
      showAllFileStats(args[0] || null);
      break;
  }
}

async function convertStreamToBuffer(
  stream: NodeJS.ReadableStream
): Promise<Buffer> {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function showFileBytes(filePath: string | null): Promise<void> {
  const fileBytes = await countBytes(filePath);

  if (!fileBytes) {
    return;
  }

  if (filePath) {
    console.log(`${fileBytes} ${filePath}`);
  } else {
    console.log(`${fileBytes}`);
  }
}

async function countBytes(filePath: string | null): Promise<number | null> {
  try {
    // check if we have filepath provided to use fs for reading file stats
    if (filePath) {
      const stats = await fs.stat(filePath);
      return stats.size;
    }

    // use stdin instead of file available locally
    const stdinConvertedToString = await convertStreamToBuffer(process.stdin);

    return stdinConvertedToString.byteLength;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function showFileLinesCount(filePath: string | null): Promise<void> {
  const lineCount = await countLines(filePath);

  if (!lineCount) {
    return;
  }

  if (filePath) {
    console.log(`${lineCount} ${filePath}`);
  } else {
    console.log(`${lineCount}`);
  }
}

async function countLines(filePath: string | null): Promise<number | null> {
  try {
    let fileStream;

    if (filePath) {
      fileStream = syncFs.createReadStream(filePath);
    }

    const rl = readline.createInterface({
      input: fileStream || process.stdin,
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

async function showFileWordCount(filePath: string | null): Promise<void> {
  const wordCount = await countWords(filePath);

  if (!wordCount) {
    return;
  }

  if (filePath) {
    console.log(`${wordCount} ${filePath}`);
  } else {
    console.log(`${wordCount}`);
  }
}

async function countWords(filePath: string | null): Promise<number | null> {
  try {
    let fileStream;

    if (filePath) {
      fileStream = syncFs.createReadStream(filePath);
    }

    const rl = readline.createInterface({
      input: fileStream || process.stdin,
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

async function showFileCharCount(filePath: string | null): Promise<void> {
  const charCount = await countChar(filePath);

  if (filePath) {
    console.log(`${charCount} ${filePath}`);
  } else {
    console.log(`${charCount}`);
  }
}

async function countChar(filePath: string | null): Promise<number | null> {
  try {
    if (filePath) {
      return (await fs.readFile(filePath)).toString().length;
    }

    return (await convertStreamToBuffer(process.stdin)).toString("utf-8")
      .length;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function showAllFileStats(filePath: string | null): Promise<void> {
  const fileBytes = await countBytes(filePath);
  const lineCount = await countLines(filePath);
  const wordCount = await countWords(filePath);

  if (filePath) {
    console.log(`${lineCount} ${wordCount} ${fileBytes} ${filePath}`);
  } else {
    console.log(`${lineCount} ${wordCount} ${fileBytes}`);
  }
}

main();
