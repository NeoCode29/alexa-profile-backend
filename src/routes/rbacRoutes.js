import express from 'express';
import * as RbacController from '../controllers/rbacController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/rbac.js';

const router = express.Router();

router.use(authenticateJWT, requirePermission('roles.manage'));

router.get('/roles', RbacController.getAllRoles);
router.post('/roles', RbacController.createRole);
router.delete('/roles/:roleId', RbacController.deleteRole);
router.get('/permissions', RbacController.getAllPermissions);
router.put('/roles/:roleId/permissions', RbacController.assignPermissionsToRole);

export default router;
