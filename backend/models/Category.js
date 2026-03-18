import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for getting media populated when querying a category
categorySchema.virtual('media', {
  ref: 'Media',
  localField: '_id',
  foreignField: 'categoryId',
  justOne: false
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
