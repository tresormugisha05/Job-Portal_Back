import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixEmployerIndex() {
    try {
        // Explicitly using the Cloud MongoDB URL provided by the user and targeting the 'test' database
        const mongoUrl = "mongodb+srv://teta:2E5Vr9Kz5kZboBwK@cluster0.62mwlgl.mongodb.net/test?appName=Cluster0";

        console.log("Connecting to Cloud MongoDB (test database)...");
        await mongoose.connect(mongoUrl);
        console.log("Connected to Cloud MongoDB");

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection failed");
        }

        console.log('Checking existing indexes on "employers" collection...');
        const indexes = await db.collection("employers").indexes();
        const indexNames = indexes.map(idx => idx.name);
        console.log("Current indexes:", indexNames);

        const indexesToDrop = ["EmployerId_1", "userId_1"];

        for (const indexName of indexesToDrop) {
            if (indexNames.includes(indexName)) {
                console.log(`Found ${indexName} index. Dropping it...`);
                await db.collection("employers").dropIndex(indexName);
                console.log(`✅ ${indexName} index dropped successfully`);
            } else {
                console.log(`ℹ️ ${indexName} index not found.`);
            }
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
