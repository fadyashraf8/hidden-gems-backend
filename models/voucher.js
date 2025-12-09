import mongoose, { Mongoose } from "mongoose";

const voucherSchema = new mongoose.Schema({
    code: {type: String, required: true},
    discount: {type: Number, required: true},
    //voucher type to differ points number from percentage number
    voucherType: {type: String, enum: ['subscription', 'points'], required: true},
    expiryDate: {type: Date, required: true},
    gemId: {type: mongoose.Types.ObjectId, ref: "gem", required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    userId: {type: mongoose.Types.ObjectId, ref: "user", required: true},
    qrCode: {type: String, required: true}
}) 

const voucherModel = mongoose.model("Voucher", voucherSchema);
export default voucherModel;