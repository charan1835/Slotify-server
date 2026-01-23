import Event from "../models/Event.js";
import Vendor from "../models/Vendor.js";
import Category from "../models/Category.js";
import Booking from "../models/Booking.js";

// ================ EVENT CONTROLLERS ================

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("categoryId", "name").sort({ date: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single event
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("categoryId", "name");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new event
export const createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        const populatedEvent = await Event.findById(newEvent._id).populate("categoryId", "name");
        res.status(201).json(populatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("categoryId", "name");

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================ VENDOR ADMIN CONTROLLERS ================

// Get all vendors (admin view)
export const getAllVendorsAdmin = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("categoryId", "name").sort({ createdAt: -1 });
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new vendor
export const createVendor = async (req, res) => {
    try {
        const newVendor = new Vendor(req.body);
        await newVendor.save();
        const populatedVendor = await Vendor.findById(newVendor._id).populate("categoryId", "name");
        res.status(201).json(populatedVendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update vendor
export const updateVendor = async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("categoryId", "name");

        if (!updatedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(updatedVendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!deletedVendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================ CATEGORY ADMIN CONTROLLERS ================

// Get all categories (admin view)
export const getAllCategoriesAdmin = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new category
export const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================ BOOKING ADMIN CONTROLLERS ================

// Get all bookings (admin view)
export const getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("vendorId", "name email phone")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        )
            .populate("vendorId", "name email phone")
            .populate("userId", "name email");

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete booking
export const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================ STATS DASHBOARD ================

export const getAdminStats = async (req, res) => {
    try {
        const [totalEvents, totalVendors, totalCategories, upcomingEvents, totalBookings, pendingBookings] = await Promise.all([
            Event.countDocuments(),
            Vendor.countDocuments(),
            Category.countDocuments(),
            Event.countDocuments({ status: "upcoming", date: { $gte: new Date() } }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "pending" })
        ]);

        res.status(200).json({
            totalEvents,
            totalVendors,
            totalCategories,
            upcomingEvents,
            totalBookings,
            pendingBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
