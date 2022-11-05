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

import {get_payer, get_program_id, } from "./util";
import { register_user, get_account_info_then_deserialize} from "./commands";

import {
    gen_sk,
    gen_pk,
    encrypt,
    decrypt
} from "./grasscrete";



import {
    command_add_friend,
    command_remove_friend,
    command_request_location,
    command_send_location,
    command_reset_location,
    command_set_pk,
    send_instruction_common,
    send_instruction_common_with_friend
} from "./commands";



(async () => {
  let connection = new Connection("http://127.0.0.1:8899", "confirmed");
  // payer is the one who deployed this smart contract on solana chain
  // payer is keypair
  let payer = await get_payer(connection);

  // programId is public key of program (this smart contract Id), means smart contract address
  // address is created by public key 1 to 1.
  let programId = await get_program_id(connection);


  // seed is decided by each user
  const seed1 = "seed1";
  const seed2 = "seed2";
  
  // toPubkey to access to the sc data account
  const toPubkey1 = await register_user(connection, payer, seed1, programId);
  const toPubkey2 = await register_user(connection, payer, seed2, programId);

  // check if account is created
  await get_account_info_then_deserialize(connection, toPubkey1);
  await get_account_info_then_deserialize(connection, toPubkey2);

  let client1_sk = gen_sk();
  let client1_pk = gen_pk(client1_sk);

  let client2_sk = gen_sk();
  let client2_pk = gen_pk(client2_sk);


  const lat = 100;
  const lng = 200;

  await command_add_friend(1, "myfriend1", toPubkey1, programId, connection, payer);


  // command_set_pk(
  //   client1_pk,
  //   toPubkey1,
  //   programId,
  //   connection,
  //   payer
  //   );

  // command_set_pk(
  //   client2_pk,
  //   toPubkey2,
  //   programId,
  //   connection,
  //   payer
  //   );

  // get account after
  console.log("\npubKey1 data acccount")
  get_account_info_then_deserialize(connection, toPubkey1);
  console.log("\npubKey2 data acccount")
  get_account_info_then_deserialize(connection, toPubkey2);
    
})();
