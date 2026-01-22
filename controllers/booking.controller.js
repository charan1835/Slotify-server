import Booking from "../models/Booking.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
    try {
        const { vendorId, userName, userEmail, userPhone, eventDate, notes, status } = req.body;
        console.log("📝 Creating Booking:", req.body);

        if (!vendorId || !eventDate || !userName || !userEmail) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }

        const booking = await Booking.create({
            vendorId,
            userId: req.user._id, // From auth middleware
            userName,
            userEmail,
            userPhone,
            eventDate,
            notes,
            status
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getVendorBookings = async (req, res) => {
    try {
        if (!req.query.vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(req.query.vendorId)) {
            return res.status(400).json({ message: "Invalid Vendor ID" });
        }
        const bookings = await Booking.find({
            vendorId: req.query.vendorId,
        }).populate("vendorId", "name email");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        // Find bookings where userId matches the logged-in user's ID
        const bookings = await Booking.find({ userId: req.user._id })
            .populate("vendorId", "name email phone image price maxPrice rating") // Populate vendor details
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
