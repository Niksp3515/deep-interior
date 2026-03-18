import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'document', 'model'],
      required: true,
    },
    mediaStage: {
      type: String,
      enum: ['3d_design', 'real_project'],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String, // Used to delete the resource from R2
      required: true,
    },
    thumbnailKey: {
      type: String, // Store R2 key for the video thumbnail
    },
    caption: {
      type: String,
    },
    originalFileName: {
      type: String,
    },
    fileExtension: {
      type: String,
    },
    mimeType: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model('Media', mediaSchema);
export default Media;
