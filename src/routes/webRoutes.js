import express from 'express';
import * as WebController from '../controllers/webController.js';
import { requireAdminAuth, redirectIfAuthenticated } from '../middlewares/auth.js';
import { requireWebPermission } from '../middlewares/rbac.js';

const router = express.Router();

// Public login page (jika sudah login, otomatis dialihkan ke /admin)
router.get('/login', redirectIfAuthenticated, WebController.renderLogin);

// Logout route: bersihkan cookie token & redirect ke login
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
});

// Seluruh rute di bawah ini memerlukan autentikasi Admin
router.use(requireAdminAuth);

router.get('/', WebController.renderDashboard);
router.get('/profile', WebController.renderProfile);
router.get('/articles', requireWebPermission('articles.manage'), WebController.renderArticles);
router.get('/articles/:id', requireWebPermission('articles.manage'), WebController.renderArticleDetailAdmin);

router.get('/services', requireWebPermission('services.manage'), WebController.renderServices);
router.get('/services/:id', requireWebPermission('services.manage'), WebController.renderServiceDetailAdmin);
router.get('/inquiries', requireWebPermission('inquiries.manage'), WebController.renderInquiries);
router.get('/roles', requireWebPermission('roles.manage'), WebController.renderRoles);
router.get('/users', requireWebPermission('users.manage'), WebController.renderUsers);
router.get('/clients', requireWebPermission('services.manage'), WebController.renderClients);
router.get('/pages', WebController.renderPages);

export default router;
