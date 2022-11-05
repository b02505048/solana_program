/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as borsh from "borsh";

import {
  Connection,
  //Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import os from "os";
import fs from "mz/fs";
import path from "path";
import yaml from "yaml";
import { Keypair } from "@solana/web3.js";

const PROGRAM_PATH = path.resolve(__dirname, "../../program");
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, "target/deploy/bank.so");
const PROGRAM_KEYPAIR_PATH = path.join(
  PROGRAM_PATH,
  "target/deploy/bank-keypair.json"
);

import { Datas, OptionSchema, DataSchema, data_account_size} from "./data";

async function getConfig(): Promise<any> {
  const CONFIG_FILE_PATH = path.resolve(
    os.homedir(),
    ".config",
    "solana",
    "cli",
    "config.yml"
  );
  const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: "utf8" });
  return yaml.parse(configYml);
}

export async function getRpcUrl(): Promise<string> {
  return "http://127.0.0.1:8899";
}

export async function getPayer(): Promise<Keypair> {
  try {
    const config = await getConfig();
    if (!config.keypair_path) throw new Error("Missing keypair path");
    return await createKeypairFromFile(config.keypair_path);
  } catch (err) {
    console.warn(
      "Failed to create keypair from CLI config file, falling back to new random keypair"
    );
    return Keypair.generate();
  }
}

export async function createKeypairFromFile(
  filePath: string
): Promise<Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}


export async function get_payer(connection: Connection): Promise<Keypair>{
  // 2. establish payer
  let fees = 0;
  const { feeCalculator } = await connection.getRecentBlockhash();
  fees += await connection.getMinimumBalanceForRentExemption(data_account_size);
  fees += feeCalculator.lamportsPerSignature * 100; // wag
  let payer: Keypair = await getPayer();

  let lamports = await connection.getBalance(payer.publicKey);
  if (lamports < fees) {
   const sig = await connection.requestAirdrop(
     payer.publicKey,
     fees - lamports
   );
   await connection.confirmTransaction(sig);
   lamports = await connection.getBalance(payer.publicKey);
  }
  return payer;
}

export async function get_program_id(connection: Connection): Promise<PublicKey>{
  // 3. check program
  let programId: PublicKey;
  try {
    const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
    programId = programKeypair.publicKey;
  } catch (err) {
    const errMsg = (err as Error).message;
    throw new Error(
      `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/helloworld.so\``
    );
  }

  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
   if (fs.existsSync(PROGRAM_SO_PATH)) {
     throw new Error(
       "Program needs to be deployed with `solana program deploy dist/program/helloworld.so`"
     );
   } else {
     throw new Error("Program needs to be built and deployed");
   }
  } else if (!programInfo.executable) {
   throw new Error(`Program is not executable`);
  }
  return programId;
}


