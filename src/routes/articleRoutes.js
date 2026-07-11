import express from 'express';
import * as ArticleController from '../controllers/articleController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/rbac.js';

const router = express.Router();

// Public Routes (untuk website frontend)
router.get('/', ArticleController.getAllArticles);
router.get('/:slug', ArticleController.getArticleBySlug);
router.post('/:slug/view', ArticleController.incrementArticleView);

// Protected Admin Routes (memerlukan hak akses articles.manage)
router.post('/', authenticateJWT, requirePermission('articles.manage'), ArticleController.createArticle);
router.put('/:id', authenticateJWT, requirePermission('articles.manage'), ArticleController.updateArticle);
router.delete('/:id', authenticateJWT, requirePermission('articles.manage'), ArticleController.deleteArticle);

export default router;
