import * as borsh from "borsh";

// Instruction variant indexes
enum InstructionVariant {
  InitializeAccount = 0,
  UploadLocation = 1,
  ResetLocation = 2,
  RequestLocation = 3,
  AddFriend = 4,
  RemoveFriend = 5,
  SetPk = 6,
}


// this is used to set datasize when creating account data
class Datas {
  lat = 0;
  lng = 0;
  pk = 0;
  ksk = 0;
  friend1 = "";
  friend2 = "";
  friend3 = "";
  friend_lat = 0;
  friend_lng = 0;
  constructor(fields: {lat: number, lng: number,
    pk:number, ksk: number,
    friend1: string, friend2: string, friend3: string,
    friend_lat: number, friend_lng: number
  } | undefined = undefined) {
  //constructor(lat: number) {
    if (fields){
      this.lat = fields.lat;
      this.lng = fields.lng;
      this.pk = fields.pk;
      this.ksk = fields.ksk;
      this.friend1 = fields.friend1;
      this.friend2 = fields.friend2;
      this.friend3 = fields.friend3;
      this.friend_lat = fields.friend_lat;
      this.friend_lng = fields.friend_lng;

    }
  }
}

// this class is used to create instruction to send it to sc
const OptionSchema = new Map([
  [Object,
    { kind: "struct",
    fields: [
      ["command", "u32"],
      ["lat", "u32"],
      ["lng", "u32"],
      ["pk", "u32"],
      ["friend_id", "u32"],
      ["friend_address", "string"],
    ] }]]);


function serializeUploadLocation(lat: number, lng: number): Uint8Array {
  return borsh.serialize(OptionSchema, {
    command: InstructionVariant.UploadLocation,
    lat: lat,
    lng: lng,
    pk: 0,
    friend_id: 0,
    friend_address: "",
  });
}

function serializeResetLocation(): Uint8Array {
  return borsh.serialize(OptionSchema, {
    command: InstructionVariant.ResetLocation,
    lat: 0,
    lng: 0,
    pk: 0,
    friend_id: 0,
    friend_address: "",
  });
}

function serializeRequestLocation(friend_id: number): Uint8Array {
  return borsh.serialize(OptionSchema, {
    ommand: InstructionVariant.RequestLocation,
    lat: 0,
    lng: 0,
    pk: 0,
    friend_id: friend_id,
    friend_address: "",
  });
}

function serializeAddFriend(friend_id: number, friend_address: string): Uint8Array{
  return borsh.serialize(OptionSchema, {
    command: InstructionVariant.AddFriend,
    lat: 0,
    lng: 0,
    pk: 0,
    friend_id: friend_id,
    friend_address: friend_address
  });

}

function serializeRemoveFriend(friend_id: number): Uint8Array{
  return borsh.serialize(OptionSchema, {
    command: InstructionVariant.RemoveFriend,
    lat: 0,
    lng: 0,
    pk: 0,
    friend_id: friend_id,
    friend_address: "",
  });

}

function serializeSetPk(pk: number): Uint8Array {
  return borsh.serialize(OptionSchema, {
    command: InstructionVariant.SetPk,
    lat: 0,
    lng: 0,
    pk: pk,
    friend_id: 0,
    friend_address: "",
  });
}

const DataSchema = new Map([
  [Datas, { kind: "struct", 
  fields: [
    ["lat", "u32"], ["lng", "u32"],
    ["pk", "u32"], ["ksk", "u32"],
    ["friend1", "string"], ["friend2", "string"], ["friend3", "string"],
    ["friend_lat", "u32"], ["friend_lng", "u32"],
  ] }],
]);


const data_account_size = borsh.serialize(DataSchema, new Datas()).length;


export{ Datas, 
  InstructionVariant,
  OptionSchema,
  DataSchema,
  data_account_size,
  serializeUploadLocation,
  serializeResetLocation,
  serializeRequestLocation,
  serializeAddFriend,
  serializeRemoveFriend, 
  serializeSetPk,

}