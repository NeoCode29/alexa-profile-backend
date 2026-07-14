import express from 'express';
import * as PageContentController from '../controllers/pageContentController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/rbac.js';

const router = express.Router();

// Public Routes (Untuk dibaca oleh Frontend React)
router.get('/', PageContentController.getAllPagesContent);
router.get('/:pageName', PageContentController.getPageContent);

// Protected Routes (Untuk diubah oleh Admin Panel)
router.put('/:pageName', authenticateJWT, requirePermission('frontend.manage'), PageContentController.updatePageContent);

export default router;
