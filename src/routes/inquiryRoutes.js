import express from 'express';
import * as InquiryController from '../controllers/inquiryController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/rbac.js';

const router = express.Router();

// Public: Submit pesan kontak dari frontend
router.post('/', InquiryController.createInquiry);

// Protected Admin Routes
router.get('/', authenticateJWT, requirePermission('inquiries.manage'), InquiryController.getAllInquiries);
router.patch('/:id/status', authenticateJWT, requirePermission('inquiries.manage'), InquiryController.updateInquiryStatus);

export default router;
