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
  crossOriginResourcePolicy: false, // Required for cross-origin image loads if serving them directly
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'", 
        "data:", 
        "https://res.cloudinary.com", 
        "https://*.r2.dev", 
        "https://pub-*.r2.dev",
        "https://lh3.googleusercontent.com" // For Google Review avatars
      ],
      mediaSrc: [
        "'self'", 
        "data:", 
        "https://res.cloudinary.com", 
        "https://*.r2.dev", 
        "https://pub-*.r2.dev"
      ],
      connectSrc: [
        "'self'", 
        "https://deep-interior.vercel.app", 
        "http://localhost:5173", 
        "http://localhost:8080"
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      frameSrc: ["'self'", "https://www.google.com/maps/", "https://maps.google.com/"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: false,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  xContentTypeOptions: true,
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
    'https://deep-interior.vercel.app',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
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

app.get('/api', (req, res) => {
  res.status(200).json({ status: "success", message: "Deep Interior API is securely functional and receiving requests." });
});

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
