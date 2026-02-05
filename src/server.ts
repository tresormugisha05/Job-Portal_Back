import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/User.Routes'
import mongoose from 'mongoose';
import userRoutes from './routes/User.Routes';
import jobRoutes from './routes/Job.Routes';
import applicationRoutes from './routes/Application.Routes';
import employerRoutes from './routes/Employer.Routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL: string =
  process.env.MONGO_URL ||
  "mongodb+srv://tresormugisha07_db_user:G5YHr8TSpTRNNIzJ@cluster10.jeu8p4p.mongodb.net/?appName=Cluster10";

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Job Portal API is running!' });
});
mongoose
  .connect(MONGO_URL)
  .then(() => console.log(" Connected to MongoDB Compass"))
  .catch((err) => console.error(" Connection error:", err));
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employers', employerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});