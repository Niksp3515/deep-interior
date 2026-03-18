import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Load env vars
dotenv.config();

// Connect to DB if URI is present (for dev without DB just skip)
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_atlas_uri_here') {
  connectDB();
}

import compression from 'compression';

const app = express();
app.set('trust proxy', 1);

// Enhance Server speed via gzip/brotli compression
app.use(compression());

// Set security headers ensuring images can be loaded cross-origin
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Body parser with tight size limit
app.use(express.json({ limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// We sanitize manually to avoid Node 20+ "req.query is read-only" errors
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query); // Mutates in place rather than reassigning the getter
  next();
});

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Global Rate limiting for APIs 
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 150, // Limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 10 minutes'
});

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Enable CORS securely
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', 
    'http://localhost:5173',
    'http://localhost:8080',
    'https://deep-interior.vercel.app',
    'http://127.0.0.1:8080'
  ],
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/google-reviews', reviewRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Deep Interior API is running...');
});

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
