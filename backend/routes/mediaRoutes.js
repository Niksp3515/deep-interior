import express from 'express';
import { deleteMedia, uploadProjectCover, getMediaByCategoryName, downloadMedia, downloadCover } from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get aggregated media by category name (Public)
router.get('/category/:categoryName', getMediaByCategoryName);

// Delete a specific media item
router.route('/:id')
  .delete(protect, deleteMedia);

// Native Proxy Download for Preserved Filenames & Streaming Protocol
router.get('/:id/download', downloadMedia);
router.get('/:id/stream', downloadMedia);

// Native Proxy Download for Cover images stored in strict R2 without models mapping
router.get('/cover/:fileKey', downloadCover);

// Standalone endpoint for uploading project covers
router.post('/cover', protect, upload.single('image'), uploadProjectCover);

// Advanced Orphan Sweeper
import { cleanupOrphans } from '../controllers/mediaController.js';
router.post('/cleanup', protect, cleanupOrphans);

export default router;
