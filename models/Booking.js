import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        userPhone: { type: String },
        eventDate: { type: Date, required: true },
        notes: String,
        status: {
            type: String,
            enum: ["pending", "confirmed", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
