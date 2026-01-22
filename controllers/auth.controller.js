import User from "../models/User.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/emailService.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate 6 digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 5 minutes expiry
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await Otp.create({
            identifier: email,
            otp: otpCode,
            expiresAt,
        });

        // Send OTP via Email
        const emailResult = await sendOtpEmail(email, otpCode);

        if (emailResult.success) {
            res.status(200).json({ message: "OTP sent successfully to your email" });
        } else {
            // Email failed but OTP is logged to console as fallback
            res.status(200).json({ message: "OTP generated (check console for development)" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const validOtp = await Otp.findOne({
            identifier: email,
            otp,
            expiresAt: { $gt: new Date() }, // Check not expired
        });

        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP is valid, destroy it (single use)
        await Otp.deleteMany({ identifier: email });

        // Find or Create User
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            user = await User.create({ email });
            isNewUser = true;
        }

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generateToken(user.id),
            isNewUser,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                token: generateToken(updatedUser.id),
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
