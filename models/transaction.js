import mongoose from "mongoose";

const transactionedVocuherSchema = new mongoose.Schema({
  code: { type: String, required: true },        
  discount: { type: Number, required: true },   
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  decision: { type: String, enum: ["accept", "reject"], required: true },
  redeemedAt: { type: Date, default: Date.now },
  gemId: { type: mongoose.Schema.Types.ObjectId, ref: "Gem" },
});

export const transactionVoucherModel = mongoose.model("TransactionedVoucher", transactionedVocuherSchema);
