import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/User.Routes";
import jobRoutes from "./routes/Job.Routes";
import applicationRoutes from "./routes/Application.Routes";
import employerRoutes from "./routes/Employer.Routes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { specs, swaggerUi } from "./config/swagger";
import { createIndexes } from "./config/indexing";
import cors from "cors";
import { error } from "console";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

const MONGO_URL: string = process.env.MONGO_URL || "mongodb://localhost:27017/job_portal";
console.log("MongoDB URL:", MONGO_URL);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Job Portal API Documentation",
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running!" });
});

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    // Create indexes after connection
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`,
  );
});
