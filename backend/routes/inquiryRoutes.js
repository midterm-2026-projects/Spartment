import express from "express";

import authenticateUser from "../middleware/authMiddleware.js";

import { requireAdmin } from "../middleware/roleMiddleware.js";

import {
  submitInquiry,
  getInquiries,
  getInquiryById,
  approveInquiryRequest,
  rejectInquiryRequest,
} from "../controller/inquiryController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.post("/", submitInquiry);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get("/", authenticateUser, requireAdmin, getInquiries);

router.get("/:id", authenticateUser, requireAdmin, getInquiryById);

router.patch(
  "/:id/approve",
  authenticateUser,
  requireAdmin,
  approveInquiryRequest,
);

router.patch(
  "/:id/reject",
  authenticateUser,
  requireAdmin,
  rejectInquiryRequest,
);

export default router;
