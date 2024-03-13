import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  name: { type: String, required: true },
  landName: { type: String, default: "-" },
  quantity: { type: Number, default: 0 },
});

export const Client = model("Client", clientSchema);
