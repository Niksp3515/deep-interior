import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String }, // URL from R2
    completionYear: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for getting categories populated when querying a project
projectSchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'projectId',
  justOne: false
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
