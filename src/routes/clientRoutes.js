import express from 'express';
import * as ClientController from '../controllers/clientController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', ClientController.getAllClients);
router.post('/', authenticateJWT, ClientController.createClient);
router.put('/:id', authenticateJWT, ClientController.updateClient);
router.delete('/:id', authenticateJWT, ClientController.deleteClient);

export default router;
