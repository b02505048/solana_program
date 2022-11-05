import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import fs from "mz/fs";
import * as borsh from "borsh";
import path from "path";
import { createKeypairFromFile, getPayer, getRpcUrl } from "./util";

import {get_payer, get_program_id, register_user, get_account_info_then_deserialize} from "./util";

import { serializeData } from "./data";


import init, {gen_pk, gen_sk, gen_ksk, encrypt, decrypt, keyswitch,
  SecretKey, PublicKey as GPublicKey, KeySwitchKey}
from "../../program/grasscrete/pkg/grasscrete.js";
import { Z_OK } from "mz/zlib";



(async () => {
  let connection = new Connection("http://127.0.0.1:8899", "confirmed");
  // payer is the one who deployed this smart contract on solana chain
  // payer is keypair
  let payer = await get_payer(connection);

  // programId is public key of program (this smart contract Id), means smart contract address
  // address is created by public key 1 to 1.
  let programId = await get_program_id(connection);


  // seed is decided by each user
  const seed = "bank";
  
  // toPubkey to access to the sc data account
  const toPubkey = await register_user(connection, payer, seed, programId);

  // check if account is created
  get_account_info_then_deserialize(connection, toPubkey);


  const command = 2;
  const lat = 100;
  const lng = 200;
  const add_friend = "myfriend1";
  const instructionData = serializeData(command, lat, lng, add_friend);

  // toPubKey == public key which has write permission to the account
  // pubKey == public key of client
  const programInstruction = new TransactionInstruction({
    // access to data account which toPubKey can write
  keys: [
    { pubkey: toPubkey, isSigner: false, isWritable: true },
    { pubkey: toPubkey, isSigner: false, isWritable: true }
    ],
  programId: programId, // address of contract
  data: Buffer.from(instructionData), // data in byte array
  });

  // payer is signer which is myself here
  // signer is wallet holder
  const programTx = await sendAndConfirmTransaction(connection, new Transaction().add(programInstruction), [payer]);

  // get account after
  get_account_info_then_deserialize(connection, toPubkey);
    
})();
