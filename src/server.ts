import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/User.Routes';
import jobRoutes from './routes/Job.Routes';
import applicationRoutes from './routes/Application.Routes';
import employerRoutes from './routes/Employer.Routes';
import { specs, swaggerUi } from './config/swagger';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL: string =
  process.env.MONGO_URL ||
  "mongodb+srv://tresormugisha07_db_user:G5YHr8TSpTRNNIzJ@cluster10.jeu8p4p.mongodb.net/?appName=Cluster10";

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

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employers', employerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});