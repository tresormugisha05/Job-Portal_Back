import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixEmailIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection failed");
    }

    console.log('Checking existing indexes on "users" collection...');
    const indexes = await db.collection("users").getIndexes();
    console.log("Current indexes:", Object.keys(indexes));

    // Drop the old email index if it exists
    if (indexes.email_1) {
      console.log("Dropping old email_1 index...");
      await db.collection("users").dropIndex("email_1");
      console.log("✅ Old email_1 index dropped successfully");
    }

    // The new sparse index will be created automatically when the schema is loaded
    console.log("✅ Database cleanup complete!");
    console.log(
      "Restart your server - the new sparse index will be created automatically.",
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error fixing email index:", error);
    process.exit(1);
  }
}

fixEmailIndex();
