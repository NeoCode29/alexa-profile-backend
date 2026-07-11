import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';

import apiRoutes from './routes/index.js';
import webRoutes from './routes/webRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine setup (EJS + express-ejs-layouts)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/admin');

// Security middleware (non-blocking for inline Bootstrap scripts in admin panel)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (Aset lokal project dahulu, lalu fallback ke referensi-admin-panel)
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/assets', express.static(path.join(__dirname, '../../referensi-admin-panel/assets')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api', apiRoutes);
app.use('/admin', webRoutes);

// Redirect root ke admin panel
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
