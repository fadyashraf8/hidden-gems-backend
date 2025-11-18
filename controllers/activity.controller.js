import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { getAllActivitiesForUser, createActivityForUser, deleteActivityById} from "../repository/activity.repository.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";

const getAllActivities = catchAsyncError(async (req, res) => {
    const userId = req.params.id;
    //check user exist
    const features = new ApiFeatures(getAllActivitiesForUser(userId), req.query)
        .paginate()
        .sort()
        .fields()
        .filter()
        .search();    
    const result = features.mongooseQuery;
    // const activityList = await getAllActivitiesForUser(userId);
    return res.status(200).send(result);
})

const postActivity = catchAsyncError(async (req, res) => {
    const userId = req.params.id;
    //check user exist
    const activity = req.body;

    const createdActivity = await createActivityForUser(activity);
    return res.status(201).send(createdActivity);
})

const deleteActivity = catchAsyncError(async (req, res, next) => {
    const activityId = req.params.id;
    const deletedActivity = await deleteActivityById(activityId);
    if(!deletedActivity) {
        return next(new AppError("Activity not found", 404));
    }
    return res.status(200).send(deletedActivity);
})

const logActivity = async (userId, action, resourceData) => {
    let activityText = "";

    switch (action) {
        case 'POST':
            activityText = `created a new item`;
            break;
        case 'PUT':
        case 'PATCH':
            activityText = `updated an item`;
            break;
        case 'DELETE':
            activityText = `deleted an item`;
            break;
        default:
            activityText = `performed an action`;
    }

    try {
        const activity = {
            userId: userId,
            text: activityText, 
            description: resourceData.name || resourceData.description || activityText
        }
        
        await createActivityForUser(activity); 
    } catch (error) {
        console.error("creating activity failed:", error.message);
    }
};
export {getAllActivities, postActivity, deleteActivity, logActivity}