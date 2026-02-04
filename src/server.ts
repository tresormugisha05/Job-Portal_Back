import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/User.Routes'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'Job Portal API is running!' });
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});