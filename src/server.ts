import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/User.Routes';
import jobRoutes from './routes/Job.Routes';
import applicationRoutes from './routes/Application.Routes';
import employerRoutes from './routes/Employer.Routes';
import adminRoutes from './routes/adminRoutes';
import { specs, swaggerUi } from './config/swagger';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

const MONGO_URL: string =
  process.env.MONGO_URL ||
  "mongodb+srv://tresormugisha07_db_user:G5YHr8TSpTRNNIzJ@cluster10.jeu8p4p.mongodb.net/job_portal?retryWrites=true&w=majority";
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Job Portal API Documentation'
}));

app.get('/', (req, res) => {
  res.json({ message: 'Job Portal API is running!' });
});

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});