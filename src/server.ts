import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/User.Routes";
import jobRoutes from "./routes/Job.Routes";
import applicationRoutes from "./routes/Application.Routes";
import employerRoutes from "./routes/Employer.Routes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { specs, swaggerUi } from "./config/swagger";
import { createIndexes } from "./config/indexing";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

const MONGO_URL: string =
  process.env.MONGO_URL ||
  "mongodb+srv://teta:2E5Vr9Kz5kZboBwK@cluster0.62mwlgl.mongodb.net/?appName=Cluster0";
console.log("MongoDB URL:", MONGO_URL);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Job Portal API Documentation",
  })
);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "Job Portal API is running!" });
});
mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Ensure indexes are created
    await createIndexes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/auth", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Global error handling for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
