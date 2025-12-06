import express from 'express';
import { protectedRoutes } from '../controllers/auth.controller.js';
import { getAllTransActionForUser } from '../controllers/transactionVoucher.controller.js';
const router = express.Router();

router.get("/", protectedRoutes, getAllTransActionForUser)

export default router;