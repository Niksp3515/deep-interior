import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const projects = await Project.find({ title: /3BHK/i });
  console.log('Project found:', projects.length > 0 ? projects[0].title : 'No');
  console.log('coverImage field:', projects.length > 0 ? projects[0].coverImage : 'N/A');
  process.exit(0);
}).catch(console.error);
