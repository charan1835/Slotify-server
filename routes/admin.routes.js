import express from "express";
import {
    // Event routes
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    // Vendor routes
    getAllVendorsAdmin,
    createVendor,
    updateVendor,
    deleteVendor,
    // Category routes
    getAllCategoriesAdmin,
    createCategory,
    updateCategory,
    deleteCategory,
    // Booking routes
    getAllBookingsAdmin,
    updateBookingStatus,
    deleteBooking,
    // Stats
    getAdminStats
} from "../controllers/admin.controller.js";

const router = express.Router();

// ================ STATS ================
router.get("/stats", getAdminStats);

// ================ EVENT ROUTES ================
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// ================ VENDOR ROUTES ================
router.get("/vendors", getAllVendorsAdmin);
router.post("/vendors", createVendor);
router.put("/vendors/:id", updateVendor);
router.delete("/vendors/:id", deleteVendor);

// ================ CATEGORY ROUTES ================
router.get("/categories", getAllCategoriesAdmin);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// ================ BOOKING ROUTES ================
router.get("/bookings", getAllBookingsAdmin);
router.put("/bookings/:id", updateBookingStatus);
router.delete("/bookings/:id", deleteBooking);

export default router;
