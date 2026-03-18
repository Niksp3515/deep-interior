import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import Project from './models/Project.js';
import Media from './models/Media.js';

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    console.log('Scanning Projects...');
    const projects = await Project.find({ coverImage: { $regex: 'res.cloudinary.com' } });
    console.log(`Found ${projects.length} projects to update.`);
    for (const project of projects) {
      project.coverImage = '';
      await project.save();
      console.log(`Cleared coverImage for project ID: ${project._id}`);
    }

    console.log('Scanning Media for Cloudinary URLs in fileKey/cloudinaryId placeholder...');
    const mediaItems = await Media.find({
      $or: [
        { fileKey: { $regex: 'res.cloudinary.com' } },
        { mediaUrl: { $regex: 'res.cloudinary.com' } }
      ]
    });
    console.log(`Found ${mediaItems.length} media items to delete.`);
    for (const media of mediaItems) {
      await media.deleteOne();
      console.log(`Deleted media item ID: ${media._id}`);
    }

    console.log('Migration complete.');
    process.exit();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
