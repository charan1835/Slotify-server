import express from "express";
import { sendOtp, verifyOtp, updateUserProfile } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.put("/profile", protect, updateUserProfile);

export default router;
