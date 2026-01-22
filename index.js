import dotenv from "dotenv";
dotenv.config(); // Move this to the TOP, before ANY other imports

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import categoryRoutes from "./routes/category.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`📡 REQUEST: ${req.method} ${req.url}`);
    next();
});

app.use("/categories", categoryRoutes);
app.use("/vendors", vendorRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("Slotify API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
app.get("/test-env", (req, res) => {
    res.json({
        PORT: process.env.PORT,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? '***HIDDEN***' : 'NOT LOADED',
        MONGO_URI: process.env.MONGO_URI ? '***HIDDEN***' : 'NOT LOADED'
    });
});