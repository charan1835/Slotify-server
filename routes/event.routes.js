import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Get all events (public)
router.get("/", async (req, res) => {
    try {
        const { categoryId, status, city } = req.query;
        const filter = {};

        if (categoryId) filter.categoryId = categoryId;
        if (status) filter.status = status;
        if (city) filter.city = new RegExp(city, "i");

        const events = await Event.find(filter)
            .populate("categoryId", "name image")
            .sort({ date: 1 });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single event by ID (public)
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("categoryId", "name image");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
