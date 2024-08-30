import { Schema, model } from "mongoose";

const personalTractorprice = new Schema({
  price: { type: String, required: true },
});

export const PersonalTractorPrice = model(
  "personalTractorPrice",
  personalTractorprice
);
