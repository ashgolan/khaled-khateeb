import { Schema, model } from "mongoose";

const tractorprice = new Schema({
  price: { type: String, required: true },
});

export const TractorPrice = model("TractorPrice", tractorprice);
