import express from 'express';
import authRoutes from './authRoutes.js';
import articleRoutes from './articleRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import rbacRoutes from './rbacRoutes.js';
import userRoutes from './userRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import clientRoutes from './clientRoutes.js';
import pageContentRoutes from './pageContentRoutes.js';

const router = express.Router();

// Register API routes
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/services', serviceRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/rbac', rbacRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/clients', clientRoutes);
router.use('/pages', pageContentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Alexa Computindo Backend Express API berjalan dengan baik.',
    timestamp: new Date().toISOString()
  });
});

export default router;
