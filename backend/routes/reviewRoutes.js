import express from 'express';
import { getGoogleReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/').get(getGoogleReviews);

export default router;
