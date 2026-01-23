import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        description: String,
        venue: { type: String, required: true },
        address: String,
        city: String,
        date: { type: Date, required: true },
        startTime: String,
        endTime: String,
        capacity: Number,
        ticketPrice: Number,
        organizer: String,
        organizerContact: String,
        organizerEmail: String,
        image: String,
        images: [String],
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
        isFeatured: { type: Boolean, default: false },
        tags: [String],
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
