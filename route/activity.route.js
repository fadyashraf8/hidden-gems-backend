import express from 'express';
const router = express.Router();
import * as activityController from '../controllers/activity.controller.js'
import { validation } from '../middleware/validation.js';
import { idParamSchema } from '../validation/auth.validation.js';
router.get("/", (req, res) => {
    return res.status(400).json({ 
        error: "Missing required parameter: id" 
    });
});
router.get("/:id",validation(idParamSchema), activityController.getAllActivities);
router.post("/", activityController.postActivity);
router.delete('/:id', activityController.deleteActivity);
export default router;
