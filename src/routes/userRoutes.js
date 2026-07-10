import express from 'express';
import * as UserController from '../controllers/userController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/rbac.js';

const router = express.Router();

router.use(authenticateJWT, requirePermission('users.manage'));

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);


export default router;
