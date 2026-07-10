import express from 'express';
import * as CareerController from '../controllers/careerController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', CareerController.getAllCareers);
router.post('/', authenticateJWT, CareerController.createCareer);
router.delete('/:id', authenticateJWT, CareerController.deleteCareer);

export default router;
