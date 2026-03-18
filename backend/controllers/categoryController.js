import Category from '../models/Category.js';
import Media from '../models/Media.js';
import { r2Client } from '../config/r2.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

// @desc    Get categories for a project
// @route   GET /api/projects/:projectId/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ projectId: req.params.projectId }).populate('media');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/projects/:projectId/categories
// @access  Private
export const createCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    
    const category = new Category({
      projectId: req.params.projectId,
      categoryName,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      console.log(`[Category Deletion] Initiating delete for Category ID: ${category._id}`);
      
      // Fetch all associated media
      const mediaList = await Media.find({ categoryId: category._id });
      console.log(`[Category Deletion] Found ${mediaList.length} media items to purge.`);
      
      for (const media of mediaList) {
        if (media.fileKey) {
          try {
            await r2Client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: media.fileKey }));
          } catch (err) {
            console.warn(`[R2 Warning] Failed to delete ${media.fileKey} during category cascade:`, err.message);
          }
        }
        if (media.thumbnailKey) {
          try {
            await r2Client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: media.thumbnailKey }));
          } catch (err) {
            console.warn(`[R2 Warning] Failed to delete thumbnail ${media.thumbnailKey} during category cascade:`, err.message);
          }
        }
      }
      
      if (mediaList.length > 0) {
        await Media.deleteMany({ categoryId: category._id });
        console.log(`[DB Sync] Purged all media records for Category ID: ${category._id}`);
      }
      
      await category.deleteOne();
      console.log(`[DB Sync] Category ID: ${category._id} deleted.`);
      res.json({ message: 'Category and all associated media strictly removed from R2 and DB' });
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  } catch (error) {
    next(error);
  }
};
