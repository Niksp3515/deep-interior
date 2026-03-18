import express from 'express';
import { authUser, registerUser, getUserProfile, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, authUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser); // Keep public temporarily to create first admin
router.get('/profile', protect, getUserProfile);

export default router;
