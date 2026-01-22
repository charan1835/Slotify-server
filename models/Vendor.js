import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        email: String,
        phone: String,
        price: Number,
        maxPrice: Number,
        rating: { type: Number, default: 0 },
        image: String,
        services: [String],
        description: String,
        availability: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
