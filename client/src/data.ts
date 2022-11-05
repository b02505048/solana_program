import * as borsh from "borsh";

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

const data_account_size = borsh.serialize(CoordinateSchema, new Coordinates()).length;


export{ Coordinates, OptionSchema, CoordinateSchema, data_account_size, serializeData}