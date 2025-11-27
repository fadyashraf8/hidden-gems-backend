
import express from "express";
import {
  getAllContacts,
  getContactById,
  getContactsByStatusHandler,
  contactSubmission,
  updateContactStatus,
  deleteContactSubmission,
  addReplyToContact,
  getUserComplaints,
  getUserContactsByEmailForAdmin,
} from "../controllers/contactUs.controller.js";
import { validation } from "../middleware/validation.js";
import {
  contactSchema,
  contactUpdateSchema,
  contactReplySchema,
} from "../validation/contactUs.validation.js";
import { allowedTo, protectedRoutes } from "../controllers/auth.controller.js";

const contactRouter = express.Router();

// Public routes - anyone can submit complaint
contactRouter.route("/")
  .post(validation(contactSchema), contactSubmission);

// User routes - users can view their own complaints
contactRouter.route("/user/:email")
  .get(getUserComplaints);

// Admin routes
contactRouter.route("/admin")
  .get(protectedRoutes, allowedTo("admin"), getAllContacts);

contactRouter.route("/admin/status/:status")
  .get(protectedRoutes, allowedTo("admin"), getContactsByStatusHandler);

contactRouter.route("/admin/:id/reply")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validation(contactReplySchema),
    addReplyToContact
  );

contactRouter.route("/admin/:id")
  .get(protectedRoutes, allowedTo("admin"), getContactById)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    validation(contactUpdateSchema),
    updateContactStatus)
  .delete(protectedRoutes, allowedTo("admin"), deleteContactSubmission);
  
contactRouter.route("/admin/email/:email")
  .get(protectedRoutes, allowedTo("admin"), getUserContactsByEmailForAdmin);

export default contactRouter;
