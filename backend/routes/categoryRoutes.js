import express from 'express';
import { deleteCategory } from '../controllers/categoryController.js';
import { uploadMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/:id')
  .delete(protect, deleteCategory);

// Nested route for media upload in a category
router.route('/:categoryId/media')
  .post(protect, upload.any(), uploadMedia);

export default router;
