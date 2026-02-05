import express from 'express';
import {
  getAllEmployers,
  addEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  getEmployerByUserId,
  verifyEmployer
} from '../controllers/Employer.Controller';

const router = express.Router();

router.get('/', getAllEmployers);
router.post('/', addEmployer);
router.get('/user/:userId', getEmployerByUserId);
router.get('/:id', getEmployerById);
router.put('/:id', updateEmployer);
router.put('/:id/verify', verifyEmployer);
router.delete('/:id', deleteEmployer);

export default router;
