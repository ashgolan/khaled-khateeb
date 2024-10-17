import { Schema, model } from "mongoose";
const date = new Date();
const year = date.getFullYear();
const month =
  date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

const personalInvestmentSchema = new Schema({
  date: { type: String, default: year + "-" + month + "-" + day },
  name: { type: String, required: true },
  other: { type: String, default: "-" },
  number: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  colored: { type: Boolean, default: false },
});

export const PersonalInvestment = model("PersonalInvestment", personalInvestmentSchema);
