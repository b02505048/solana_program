
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

import {
  serializeUploadLocation,
  serializeResetLocation,
  serializeRequestLocation,
  serializeAddFriend,
  serializeRemoveFriend, 
  serializeSetPk,
} from "./data";

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

const multiple = 1000.0;

import { Datas, OptionSchema, DataSchema, data_account_size} from "./data";

export async function register_user(connection: Connection, payer: Keypair, seed: string, programId: PublicKey): Promise<PublicKey>{
  // toPubKey holds write permission to account data
  // each user makes toPubKey
  // service registration
  let toPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    seed,
    programId
  );

  
  // getAccountInfo to get account_info
  const account = await connection.getAccountInfo(toPubkey);

  // if account does not exist, create account
  // need to pay lamports depends on datasize
  if (account === null) {
   const lamports = await connection.getMinimumBalanceForRentExemption(
    data_account_size
   );
  
   // account is data account
   const transaction = new Transaction().add(
     SystemProgram.createAccountWithSeed({
       fromPubkey: payer.publicKey,
       basePubkey: payer.publicKey,
       seed: seed, // seed must be same
       newAccountPubkey: toPubkey, // associate account to toPubKey
       lamports,
       space: data_account_size,
       programId,
     })
   );
   // create account
   await sendAndConfirmTransaction(connection, transaction, [payer]);
  }

  return toPubkey;
}

export async function get_account_info_then_deserialize(connection: Connection, toPubkey: PublicKey): Promise<void>{
  // after created account, check the account_info
  const accountInfo = await connection.getAccountInfo(toPubkey);
  if (accountInfo === null) {
  throw "Error: cannot find the account";
  }
  const res = borsh.deserialize(DataSchema, Datas, accountInfo.data);
  console.log("\ndeserialized result:");
  console.log(res);

}

const send_instruction_common = async(instructionData: Uint8Array, toPubKey: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    const programInstruction = new TransactionInstruction({
        // access to data account which toPubKey can write
    keys: [
        { pubkey: toPubKey, isSigner: false, isWritable: true },
        ],
    programId: programId, // address of contract
    data: Buffer.from(instructionData), // data in byte array
    });

    // payer is signer which is myself here
    // signer is wallet holder
    const programTx = await sendAndConfirmTransaction(connection, new Transaction().add(programInstruction), [payer]);
}

const send_instruction_common_with_friend = async(instructionData: Uint8Array, toPubKey1: PublicKey, toPubkey2: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    const programInstruction = new TransactionInstruction({
        // access to data account which toPubKey can write
    keys: [
        { pubkey: toPubKey1, isSigner: false, isWritable: true },
        { pubkey: toPubkey2, isSigner: false, isWritable: true },
        ],
    programId: programId, // address of contract
    data: Buffer.from(instructionData), // data in byte array
    });

    // payer is signer which is myself here
    // signer is wallet holder
    const programTx = await sendAndConfirmTransaction(connection, new Transaction().add(programInstruction), [payer]);
}

const command_send_location = async(lat: number, lng: number, toPubKey: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    lat = lat * multiple;
    lng = lng * multiple;
    const instructionData = serializeUploadLocation(lat, lng);
    send_instruction_common(
        instructionData, toPubKey, programId, connection, payer
    );
}

const command_reset_location  = async(toPubKey: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    const instructionData = serializeResetLocation();
    send_instruction_common(
        instructionData, toPubKey, programId, connection, payer
    );
}

const command_request_location  = async(friend_id: number, toPubKey1: PublicKey, toPubKey2: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    const instructionData = serializeRequestLocation(friend_id);
    send_instruction_common_with_friend(
        instructionData, toPubKey1, toPubKey2, programId, connection, payer
    );
}

const command_add_friend = async(friend_id: number, friend_address: string, toPubKey: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    const instructionData = serializeAddFriend(friend_id, friend_address);
    send_instruction_common(
        instructionData, toPubKey, programId, connection, payer
    );
}

const command_remove_friend = async(friend_id: number, toPubKey: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    const instructionData = serializeRemoveFriend(friend_id);
    send_instruction_common(
        instructionData, toPubKey, programId, connection, payer
    );
}

const command_set_pk = async(pk: number, toPubKey: PublicKey, programId: PublicKey, connection: Connection, payer: Keypair) => {
    pk = pk * multiple;
    const instructionData = serializeSetPk(pk);
    send_instruction_common(
        instructionData, toPubKey, programId, connection, payer
    );
}

export{
    command_add_friend,
    command_remove_friend,
    command_request_location,
    command_send_location,
    command_reset_location,
    command_set_pk,
    send_instruction_common,
    send_instruction_common_with_friend
}