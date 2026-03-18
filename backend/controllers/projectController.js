import Project from '../models/Project.js';
import Category from '../models/Category.js';
import Media from '../models/Media.js';
import { r2Client } from '../config/r2.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.location) {
      filter.location = req.query.location;
    }
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    
    const formattedProjects = projects.map(proj => proj.toObject());

    res.json(formattedProjects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: 'categories',
      populate: {
        path: 'media'
      }
    });

    if (project) {
      const p = project.toObject();
      res.json(p);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { title, location, description, coverImage, completionYear } = req.body;

    if (!title || !location || !completionYear) {
      res.status(400);
      throw new Error('Please provide title, location, and completion year. These are strictly required.');
    }

    const project = new Project({
      title,
      location,
      description,
      coverImage: coverImage || '',
      completionYear,
    });

    const createdProject = await project.save();
    
    const p = createdProject.toObject();
    res.status(201).json(p);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    const { title, location, description, coverImage, completionYear } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.location = location || project.location;
      project.description = description || project.description;
      project.coverImage = coverImage || project.coverImage;
      project.completionYear = completionYear || project.completionYear;

      const updatedProject = await project.save();
      
      const p = updatedProject.toObject();
      res.json(p);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      console.log(`[Project Deletion] Initiating delete for Project ID: ${project._id}`);

      // Delete Cover Image from R2
      if (project.coverImage) {
        const coverKey = project.coverImage.split('/').pop();
        if (coverKey && coverKey !== 'placeholder.jpg') {
          try {
            console.log(`[R2 Sync] Deleting Project Cover: ${coverKey}`);
            await r2Client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: coverKey }));
          } catch (err) {
            console.warn(`[R2 Warning] Failed to delete cover ${coverKey}:`, err.message);
          }
        }
      }

      // Fetch all associated media
      const mediaList = await Media.find({ projectId: project._id });
      console.log(`[Project Deletion] Found ${mediaList.length} media items to purge.`);

      for (const media of mediaList) {
        if (media.fileKey) {
          try {
            await r2Client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: media.fileKey }));
          } catch (err) {
            console.warn(`[R2 Warning] Failed to delete media ${media.fileKey}:`, err.message);
          }
        }
        if (media.thumbnailKey) {
          try {
            await r2Client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: media.thumbnailKey }));
          } catch (err) {
            console.warn(`[R2 Warning] Failed to delete thumbnail ${media.thumbnailKey}:`, err.message);
          }
        }
      }

      if (mediaList.length > 0) {
        await Media.deleteMany({ projectId: project._id });
        console.log(`[DB Sync] Purged all media records for Project ID: ${project._id}`);
      }

      const categories = await Category.find({ projectId: project._id });
      if (categories.length > 0) {
        await Category.deleteMany({ projectId: project._id });
        console.log(`[DB Sync] Purged ${categories.length} categories for Project ID: ${project._id}`);
      }

      await project.deleteOne();
      console.log(`[DB Sync] Project ID: ${project._id} strictly deleted.`);
      res.json({ message: 'Project and all related data (DB & R2) strictly removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};
