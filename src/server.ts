import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/User.Routes';
import jobRoutes from './routes/Job.Routes';
import applicationRoutes from './routes/Application.Routes';
import employerRoutes from './routes/Employer.Routes';
import adminRoutes from './routes/adminRoutes';
import { specs, swaggerUi } from './config/swagger';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});