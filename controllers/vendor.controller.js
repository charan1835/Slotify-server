import Vendor from "../models/Vendor.js";
import mongoose from "mongoose";

export const getVendorsByCategory = async (req, res) => {
    try {
        let query = {};

        if (req.query.categoryId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.categoryId)) {
                return res.status(400).json({ message: "Invalid Category ID" });
            }
            query.categoryId = req.query.categoryId;
        }

        const vendors = await Vendor.find(query).populate("categoryId");
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
