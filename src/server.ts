import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/User.Routes';
import jobRoutes from './routes/Job.Routes';
import applicationRoutes from './routes/Application.Routes';
import employerRoutes from './routes/Employer.Routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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