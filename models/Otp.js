import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    identifier: { type: String, required: true }, // email or phone
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);
