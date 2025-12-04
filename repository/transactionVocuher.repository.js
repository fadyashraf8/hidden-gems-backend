import { transactionVoucherModel } from "../models/transaction.js";

export const createTransactionVoucher = async (voucher) => {
    return await transactionVoucherModel.create(voucher);
}

export const getAllTransactionsById = async (id) => {
    return await transactionVoucherModel.find({user: id});
}