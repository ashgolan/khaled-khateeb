import { Schema, model } from "mongoose";
const date = new Date();
const year = date.getFullYear();
const month =
  date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

const saleSchema = new Schema({
  date: { type: String, default: year + "-" + month + "-" + day },
  clientName: { type: String, required: true },
  purpose: { type: String, required: true },
  landName: { type: String, required: true },
  strains: { type: String, default: "-" },
  quantity: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  number: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  colored: { type: Boolean, default: false },
});

export const Sale = model("Sale", saleSchema);
