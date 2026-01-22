import express from "express";
import {
    createBooking,
    getVendorBookings,
    getUserBookings,
    updateBookingStatus,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Protected Routes
import { protect } from "../middleware/auth.middleware.js";

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);

// Public/Vendor Routes
router.get("/", getVendorBookings);
router.patch("/:id", updateBookingStatus);

export default router;
