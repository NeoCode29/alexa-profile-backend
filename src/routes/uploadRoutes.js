import express from 'express';
import { upload, processImageUpload } from '../middlewares/upload.js';
import * as UploadController from '../controllers/uploadController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticateJWT, upload.single('image'), processImageUpload, UploadController.uploadImage);

export default router;
