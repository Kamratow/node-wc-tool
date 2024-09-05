#!/usr/bin/env node
import fs from "node:fs/promises";
import readline from "node:readline";
import { Readable } from "node:stream";

function getFilePath(commandArgs: string[]): string | null {
  if (!process.stdin.isTTY) {
    return null;
  }

  if (process.argv.length === 4) {
    return commandArgs[1];
  }

  return commandArgs[0];
}

async function main(): Promise<void> {
  // we get third argument here as first one would be 'node' and the second one the script file we run
  const args = process.argv.slice(2);
  const wcArg = args[0];
  const filePath = getFilePath(args);
  const fileBuffer = filePath
    ? await fs.readFile(filePath)
    : await convertStreamToBuffer(process.stdin);

  switch (wcArg) {
    case "-c":
      showFileBytes(filePath, fileBuffer);
      break;
    case "-l":
      showFileLinesCount(filePath, fileBuffer);
      break;
    case "-w":
      showFileWordCount(filePath, fileBuffer);
      break;
    case "-m":
      showFileCharCount(filePath, fileBuffer);
      break;
    default:
      showAllFileStats(args[0] || null, fileBuffer);
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

async function showFileBytes(
  filePath: string | null,
  fileBuffer: Buffer
): Promise<void> {
  const fileBytes = countBytes(fileBuffer);

  if (filePath) {
    console.log(`${fileBytes} ${filePath}`);
  } else {
    console.log(`${fileBytes}`);
  }
}

function countBytes(fileBuffer: Buffer): number {
  return fileBuffer.byteLength;
}

async function showFileLinesCount(
  filePath: string | null,
  fileBuffer: Buffer
): Promise<void> {
  const lineCount = await countLines(fileBuffer);

  if (!lineCount) {
    return;
  }

  if (filePath) {
    console.log(`${lineCount} ${filePath}`);
  } else {
    console.log(`${lineCount}`);
  }
}

async function countLines(fileBuffer: Buffer): Promise<number | null> {
  try {
    const fileStream = Readable.from(fileBuffer);

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

async function showFileWordCount(
  filePath: string | null,
  fileBuffer: Buffer
): Promise<void> {
  const wordCount = await countWords(fileBuffer);

  if (!wordCount) {
    return;
  }

  if (filePath) {
    console.log(`${wordCount} ${filePath}`);
  } else {
    console.log(`${wordCount}`);
  }
}

async function countWords(fileBuffer: Buffer): Promise<number | null> {
  try {
    const fileStream = Readable.from(fileBuffer);

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

async function showFileCharCount(
  filePath: string | null,
  fileBuffer: Buffer
): Promise<void> {
  const charCount = countChar(fileBuffer);

  if (filePath) {
    console.log(`${charCount} ${filePath}`);
  } else {
    console.log(`${charCount}`);
  }
}

function countChar(fileBuffer: Buffer): number | null {
  try {
    return fileBuffer.toString().length;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function showAllFileStats(
  filePath: string | null,
  fileBuffer: Buffer
): Promise<void> {
  const fileBytes = countBytes(fileBuffer);
  const lineCount = await countLines(fileBuffer);
  const wordCount = await countWords(fileBuffer);

  if (filePath) {
    console.log(`${lineCount} ${wordCount} ${fileBytes} ${filePath}`);
  } else {
    console.log(`${lineCount} ${wordCount} ${fileBytes}`);
  }
}

main();
