import express from 'express';
import * as AuthController from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticateJWT, AuthController.getMe);
router.put('/profile', authenticateJWT, AuthController.updateProfile);
router.put('/change-password', authenticateJWT, AuthController.changePassword);

// API Integration Token endpoints
router.get('/api-token-info', authenticateJWT, AuthController.getApiTokenInfo);
router.post('/verify-api-token', AuthController.verifyApiToken);

export default router;
