import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Vendor from "./models/Vendor.js";
import Booking from "./models/Booking.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await Category.deleteMany({});
        await Vendor.deleteMany({});
        await Booking.deleteMany({}); // Optional: clear bookings to start fresh, maybe better for "Unknown" issue
        console.log("Cleared existing data.");

        // 1. Create Categories with deterministic IDs matched to Frontend
        const categories = [
            {
                _id: "507f1f77bcf86cd799439011",
                name: "Photography",
                image: "/assets/categories/photography.png",
                description: "Capture your best moments"
            },
            {
                _id: "507f1f77bcf86cd799439012",
                name: "Catering",
                image: "/assets/categories/catering.png",
                description: "Delicious food for your event"
            },
            {
                _id: "507f1f77bcf86cd799439013",
                name: "Venue",
                image: "/assets/categories/venue.png",
                description: "Perfect locations"
            },
            {
                _id: "507f1f77bcf86cd799439014",
                name: "Makeup",
                image: "/assets/categories/makeup.png",
                description: "Look your best"
            }
        ];

        await Category.create(categories);
        console.log("Categories seeded.");

        // 2. Create Vendors using the EXACT IDs from our Frontend Demo/Fallback
        // This ensures compatibility and allows population to work.
        const vendors = [
            // Photography Vendors
            {
                _id: "507f1f77bcf86cd799439091",
                name: "Lens & Light Studios",
                categoryId: "507f1f77bcf86cd799439011",
                email: "contact@lensandlight.com",
                phone: "9876543210",
                price: 1500,
                maxPrice: 4000,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Premium wedding photography"
            },
            {
                _id: "507f1f77bcf86cd799439092",
                name: "Capture Moments",
                categoryId: "507f1f77bcf86cd799439011",
                email: "hello@capturemoments.com",
                phone: "9876543211",
                price: 1200,
                maxPrice: 3000,
                rating: 4.6,
                image: "https://images.unsplash.com/photo-1542038784424-48ed221f704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Candid specialists"
            },
            {
                _id: "507f1f77bcf86cd799439093",
                name: "Golden Hour Clicks",
                categoryId: "507f1f77bcf86cd799439011",
                email: "bookings@goldenhour.com",
                phone: "9876543212",
                price: 2000,
                maxPrice: 5000,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Award winning photographers"
            },

            // Catering Vendors
            {
                _id: "507f1f77bcf86cd799439094",
                name: "Gourmet Delights",
                categoryId: "507f1f77bcf86cd799439012",
                email: "food@gourmet.com",
                phone: "9876543213",
                price: 800,
                maxPrice: 2500,
                rating: 4.5,
                image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Exquisite culinary experiences"
            },
            {
                _id: "507f1f77bcf86cd799439095",
                name: "Royal Feast Catering",
                categoryId: "507f1f77bcf86cd799439012",
                email: "feast@royal.com",
                phone: "9876543214",
                price: 1000,
                maxPrice: 3500,
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Royal treatment for your guests"
            },

            // Venue Vendors
            {
                _id: "507f1f77bcf86cd799439096",
                name: "Grand Palace Hotel",
                categoryId: "507f1f77bcf86cd799439013",
                email: "events@grandpalace.com",
                phone: "9876543215",
                price: 50000,
                maxPrice: 150000,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Luxury ballroom venue"
            },
            {
                _id: "507f1f77bcf86cd799439097",
                name: "Sunset Garden Lawn",
                categoryId: "507f1f77bcf86cd799439013",
                email: "info@sunsetgarden.com",
                phone: "9876543216",
                price: 20000,
                maxPrice: 60000,
                rating: 4.4,
                image: "https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Open air garden venue"
            },

            // Makeup Vendors
            {
                _id: "507f1f77bcf86cd799439098",
                name: "Glamour Touch",
                categoryId: "507f1f77bcf86cd799439014",
                email: "beauty@glamour.com",
                phone: "9876543217",
                price: 3000,
                maxPrice: 8000,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Professional bridal makeup"
            },
            {
                _id: "507f1f77bcf86cd799439099",
                name: "Elegant Look",
                categoryId: "507f1f77bcf86cd799439014",
                email: "style@elegant.com",
                phone: "9876543218",
                price: 2500,
                maxPrice: 6000,
                rating: 4.5,
                image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Hair and makeup studio"
            }
        ];

        await Vendor.create(vendors);
        console.log("Vendors seeded.");

        console.log("Database seed completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
