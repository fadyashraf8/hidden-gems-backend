import voucherModel from "../models/voucher.js";

export const createVoucher = async (voucherData, session) => {
  const [createdVoucher] = await voucherModel.create([voucherData], { session });
  return createdVoucher;
};

export const getVoucherByCode = async (code) => {
  return await voucherModel
    .findOne({ code: code })
    .populate("gemId","name category")
    .populate("userId"," firstName lastName email");
};

export const getVoucherByUserIdAndGemId = async (userId, gemId, session) => {
  return await voucherModel
    .findOne({ userId: userId, gemId: gemId })
    .populate("gemId")
    .populate("userId").session(session);
};

export const deleteVoucherByCode = async (code) => {
  return await voucherModel.findOneAndDelete({ code: code });
};
export const deleteVoucherByIdAndUserId = async (voucherId, userId) => {
  return await voucherModel.findOneAndDelete({
    _id: voucherId,
    userId: userId,
  });
};

export const getAllVouchersForUser = async (id, session) => {
  return await voucherModel
    .find({ userId: id })
    .populate("gemId")
    .populate("userId").session(session);
};

export const getAllVouchersByGemId = async (gemId) => {
  return await voucherModel
    .find({ gemId: gemId })
    .populate("gemId")
    .populate("userId");
};

export const getAllVouchersQuery = () => {
  return voucherModel.find({}).populate("gemId").populate("userId");
};

export const getAllVouchersByGemIdQuery = (gemId) => {
  return voucherModel
    .find({ gemId: gemId })
    .populate("gemId")
    .populate("userId");
};

export const countWeeklyVouchers = async (userId, start, end) => {
    return await voucherModel.countDocuments({
        userId: userId,
        createdAt: {$gte: start, $lt: end}
    })
}