import express from 'express';
import * as ServiceController from '../controllers/serviceController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/rbac.js';

const router = express.Router();

// Public Routes
router.get('/', ServiceController.getAllServices);
router.get('/:id', ServiceController.getServiceById);

// Protected Admin Routes
router.post('/', authenticateJWT, requirePermission('services.manage'), ServiceController.createService);
router.put('/:id', authenticateJWT, requirePermission('services.manage'), ServiceController.updateService);
router.delete('/:id', authenticateJWT, requirePermission('services.manage'), ServiceController.deleteService);

router.post('/packages', authenticateJWT, requirePermission('services.manage'), ServiceController.createPackage);
router.put('/packages/:id', authenticateJWT, requirePermission('services.manage'), ServiceController.updatePackage);
router.delete('/packages/:id', authenticateJWT, requirePermission('services.manage'), ServiceController.deletePackage);

// Interactive Portfolio & Testimonial Routes
router.post('/:serviceId/portfolios', authenticateJWT, requirePermission('services.manage'), ServiceController.addPortfolio);
router.put('/:serviceId/portfolios/:itemId', authenticateJWT, requirePermission('services.manage'), ServiceController.updatePortfolio);
router.delete('/:serviceId/portfolios/:itemId', authenticateJWT, requirePermission('services.manage'), ServiceController.deletePortfolio);

router.post('/:serviceId/testimonials', authenticateJWT, requirePermission('services.manage'), ServiceController.addTestimonial);
router.put('/:serviceId/testimonials/:itemId', authenticateJWT, requirePermission('services.manage'), ServiceController.updateTestimonial);
router.delete('/:serviceId/testimonials/:itemId', authenticateJWT, requirePermission('services.manage'), ServiceController.deleteTestimonial);

export default router;
