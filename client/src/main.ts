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

const PROGRAM_PATH = path.resolve(__dirname, "../../program");
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, "target/deploy/bank.so");
const PROGRAM_KEYPAIR_PATH = path.join(
  PROGRAM_PATH,
  "target/deploy/bank-keypair.json"
);



class BankAccount {
  balance = 0;
  constructor(fields: { balance: number } | undefined = undefined) {
    if (fields) {
      this.balance += fields.balance;
    }
  }
}

class Coordinates {
  lat = 0;
  lng = 0;
  constructor(fields: {lat: number, lng: number} | undefined = undefined) {
  //constructor(lat: number) {
    if (fields){
      this.lat = fields.lat;
      this.lng = fields.lng;

    }
  }
}



//const OptionSchema = new Map([[Object, { kind: "struct", fields: [["command", "u32"]] }]]);

//const OptionSchema = new Map([[Object, { kind: "struct", fields: [["command", "u32"], ["lat", "u32"], ["lng", "u32"]] }]]);
const OptionSchema = new Map([
  [Object,
    { kind: "struct",
    fields: [
      ["command", "u32"],
      ["lat", "u32"],
      ["lng", "u32"],
      ["add_friend", "String"],
    ] }]]);

function serializeData(command: Number, lat: number, lng: number, add_friend: string): Uint8Array {
  return borsh.serialize(OptionSchema, {command,  lat, lng, add_friend});
}

const CoordinateSchema = new Map([
  [Coordinates, { kind: "struct", fields: [["lat", "u32"], ["lng", "u32"]] }],
  //[Coordinates, { kind: "struct", fields: [["lat", "u32"]] }],
]);

function makeInitialData(lat: number, lng: number): Uint8Array {
  return borsh.serialize(CoordinateSchema, {lat, lng});
}

const coordinate_size = borsh.serialize(CoordinateSchema, new Coordinates()).length;


let connection = new Connection("http://127.0.0.1:8899", "confirmed");

async function get_payer(): Promise<Keypair>{
  // 2. establish payer
  let fees = 0;
  const { feeCalculator } = await connection.getRecentBlockhash();
  fees += await connection.getMinimumBalanceForRentExemption(coordinate_size);
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

async function get_public_key(payer: Keypair): Promise<PublicKey>{
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

(async () => {
  let payer = await get_payer();

  let programId = await get_public_key(payer);

  const MY_SEED = "bank";
  let toPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    MY_SEED,
    programId
  );


  const account = await connection.getAccountInfo(toPubkey);
  if (account === null) {
   const lamports = await connection.getMinimumBalanceForRentExemption(
    coordinate_size
   );

   const transaction = new Transaction().add(
     SystemProgram.createAccountWithSeed({
       fromPubkey: payer.publicKey,
       basePubkey: payer.publicKey,
       seed: MY_SEED,
       newAccountPubkey: toPubkey,
       lamports,
       space: coordinate_size,
       programId,
     })
   );
   await sendAndConfirmTransaction(connection, transaction, [payer]);
  }

  // 5. check result
  const accountInfo = await connection.getAccountInfo(toPubkey);
  if (accountInfo === null) {
  throw "Error: cannot find the bank account";
  }
  console.log("debug-1")
  console.log(accountInfo.data);
  const res = borsh.deserialize(
  CoordinateSchema,
  Coordinates,
  accountInfo.data
  );
  console.log(res);


  //  // 4. send transaction
  //  const instruction = new TransactionInstruction({
  //  keys: [{ pubkey: toPubkey, isSigner: false, isWritable: true }],
  //  programId,
  //  data: Buffer.alloc(0),
  //  });
  //  await sendAndConfirmTransaction(
  //  connection,
  //  new Transaction().add(instruction),
  //  [payer]
  //  );



const command = 2;
const lat = 100;
const lng = 200;
const add_friend = "myfriend1";
const instructionData = serializeData(command, lat, lng, add_friend);
console.log("\ndebug2");

const programInstruction = new TransactionInstruction({
 keys: [{ pubkey: toPubkey, isSigner: false, isWritable: true }],
 programId: programId,
 data: Buffer.from(instructionData),
});
console.log("\ndebug3");

const programTx = await sendAndConfirmTransaction(connection, new Transaction().add(programInstruction), [payer]);


console.log("done the program", programTx);

// 5. check result
const accountInfo_res = await connection.getAccountInfo(toPubkey);
if (accountInfo_res === null) {
 throw "Error: cannot find the bank account";
}
const res1 = borsh.deserialize(
 CoordinateSchema,
 Coordinates,
 accountInfo_res.data
);
console.log(res1);
  
})();
