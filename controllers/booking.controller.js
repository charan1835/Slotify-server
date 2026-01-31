import Booking from "../models/Booking.js";
import Vendor from "../models/Vendor.js"; // Import Vendor
import mongoose from "mongoose";
import { createNotification } from "./notification.controller.js";
import { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail } from "../utils/emailService.js"; // Import Email Service

export const createBooking = async (req, res) => {
    try {
        const { vendorId, userName, userEmail, userPhone, eventDate, notes, status } = req.body;
        console.log("📝 Creating Booking:", req.body);

        if (!vendorId || !eventDate || !userName || !userEmail) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch vendor details for email (and validation)
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
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

        // Determine Notification Type based on Status
        const isPending = status === 'pending';
        const notificationMessage = isPending
            ? `Your booking request for ${new Date(eventDate).toLocaleDateString()} with ${vendor.name} has been placed and is pending payment.`
            : `Your booking for ${new Date(eventDate).toLocaleDateString()} with ${vendor.name} has been confirmed!`;

        const notificationType = isPending ? 'info' : 'success';

        // Notify User via In-App Notification
        await createNotification({
            recipient: req.user._id,
            message: notificationMessage,
            type: notificationType,
            relatedId: booking._id,
            relatedModel: 'Booking'
        });

        // Send Email (Confirmation or Pending)
        // If Pending, we might want to send a different email, but for now, let's use the Status Update email logic which is flexible,
        // OR reuse Confirmation if we don't mind it saying "Confirmed" (wait, Confirmation Email hardcodes "Confirmed").
        // BETTER: Use sendBookingStatusUpdateEmail for 'pending' or creating a specific 'Placement' email.
        // For simplicity/speed, let's use sendBookingStatusUpdateEmail for pending, and sendBookingConfirmationEmail for confirmed.

        if (status === 'confirmed') {
            await sendBookingConfirmationEmail(userEmail, {
                bookingId: booking._id,
                userName,
                eventDate,
                amount: vendor.price,
                vendorName: vendor.name
            });
        } else {
            // Send "Pending" or "Received" email
            await sendBookingStatusUpdateEmail(userEmail, {
                bookingId: booking._id,
                userName: userName,
                eventDate: eventDate,
                vendorName: vendor.name,
                status: status, // 'pending'
                notes: notes
            });
        }

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
        ).populate('vendorId'); // Populate vendor to get name

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Notify User via Email
        if (booking.userEmail) {
            await sendBookingStatusUpdateEmail(booking.userEmail, {
                bookingId: booking._id,
                userName: booking.userName,
                eventDate: booking.eventDate,
                vendorName: booking.vendorId.name,
                status: booking.status,
                notes: booking.notes
            });
        }

        // Notify User via In-App Notification (Using userId from booking if stored, otherwise rely on email only or store userId in booking model)
        // Note: In createBooking we stored userId.
        if (booking.userId) {
            await createNotification({
                recipient: booking.userId,
                message: `Your booking with ${booking.vendorId.name} has been updated to: ${booking.status}`,
                type: booking.status === 'confirmed' ? 'success' : 'info',
                relatedId: booking._id,
                relatedModel: 'Booking'
            });
        }

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
