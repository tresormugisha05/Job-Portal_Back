import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixEmployerIndex() {
    try {
        const mongoUrl = process.env.MONGO_URL || "mongodb+srv://teta:2E5Vr9Kz5kZboBwK@cluster0.62mwlgl.mongodb.net/?appName=Cluster0"; // Fallback to the one provided by user if .env is missing it

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection failed");
        }

        console.log('Checking existing indexes on "employers" collection...');
        const indexes = await db.collection("employers").indexes();
        console.log("Current indexes:", indexes.map(idx => idx.name));

        // Drop the old EmployerId index if it exists
        const employerIdIndex = indexes.find(idx => idx.name === "EmployerId_1");
        if (employerIdIndex) {
            console.log("Found EmployerId_1 index. Dropping it...");
            await db.collection("employers").dropIndex("EmployerId_1");
            console.log("✅ EmployerId_1 index dropped successfully");
        } else {
            console.log("ℹ️ EmployerId_1 index not found. It might have already been dropped or never existed.");
        }

        console.log("✅ Index cleanup complete!");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error fixing employer index:", error);
        process.exit(1);
    }
}

fixEmployerIndex();
