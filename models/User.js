import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String }, // Optional initially, can be updated
        email: { type: String, required: true, unique: true },
        phone: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
