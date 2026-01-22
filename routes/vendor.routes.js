import express from "express";
import {
    getVendorsByCategory,
    getVendorById,
} from "../controllers/vendor.controller.js";

const router = express.Router();

router.get("/", getVendorsByCategory);
router.get("/:id", getVendorById);

export default router;
