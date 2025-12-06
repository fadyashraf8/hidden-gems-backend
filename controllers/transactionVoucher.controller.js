import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import * as repository from "../repository/transactionVocuher.repository.js";
const getAllTransActionForUser = catchAsyncError(async (req, res, next) => {
    const id = req.user._id;
    const apifeatures = new ApiFeatures(repository.getAllTransactionsByIdQuery(id), req.query);
    const countQuery = new ApiFeatures(repository.getAllTransactionsByIdQuery(id), req.query)
            .filter()
            .search();

    const totalItems = await countQuery.mongooseQuery.countDocuments();
    const totalPages =  Math.ceil(totalItems / apifeatures.limit);
    const result = await apifeatures.mongooseQuery;
    res.status(200).send({
        message: "success",
        page: apifeatures.page,
        totalItems,
        totalPages,
        result,
    })        
})

export {getAllTransActionForUser}