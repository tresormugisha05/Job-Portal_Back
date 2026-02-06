import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { profileUpload } from '../middleware/profileUpload.middleware';
import { uploadProfilePicture } from '../controllers/uploadController';
const router = express.Router();
router.post('/profile', protect, profileUpload.single('profile'), uploadProfilePicture);
export default router;