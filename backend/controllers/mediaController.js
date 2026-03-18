import Media from '../models/Media.js';
import Category from '../models/Category.js';
import { r2Client } from '../config/r2.js';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs from 'fs';
import mime from 'mime-types';
import sharp from 'sharp';
import Project from '../models/Project.js';

// Helper function to upload to R2 natively from disk temp path
const uploadToR2 = async (file) => {
  let contentType = mime.lookup(file.originalname) || file.mimetype;

  // Intercept images to aggressively compress and optimize via Sharp
  if (contentType.startsWith('image/') && !contentType.includes('svg') && !contentType.includes('gif')) {
    const optimizedPath = file.path + '.webp';
    await sharp(file.path)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })    
      .webp({ quality: 80, force: true })
      .toFile(optimizedPath);
    
    // Clear out the massive original memory footprint so we don't leak space
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    
    // Remap pointers so the rest of the stream and the caller's cleanup handles the webp
    file.path = optimizedPath;
    file.originalname = file.originalname.replace(/\.[^/.]+$/, "") + ".webp";
    file.mimetype = 'image/webp';
    contentType = 'image/webp';
  }

  const fileStream = fs.createReadStream(file.path);
  const fileKey = `${Date.now()}-${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.R2_BUCKET,
    Key: fileKey,
    Body: fileStream,
    ContentType: contentType,
  };

  try {
    await r2Client.send(new PutObjectCommand(uploadParams));
    return {
      fileKey,
      contentType
    };
  } catch (error) {
    throw error;
  }
};

// @desc    Upload media for a category
// @route   POST /api/categories/:categoryId/media
// @access  Private
export const uploadMedia = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { projectId, mediaStage, caption } = req.body;
    
    const mediaFiles = req.files.filter(f => f.fieldname === 'media');
    const thumbFiles = req.files.filter(f => f.fieldname.startsWith('thumbnail_'));

    if (!mediaFiles || mediaFiles.length === 0) {
      req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
      res.status(400);
      throw new Error('No media files uploaded');
    }

    if (!projectId || !mediaStage) {
      req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
      res.status(400);
      throw new Error('projectId and mediaStage are required');
    }

    const uploadedMediaData = [];

    // Pre-flight file size validations
    for (const file of req.files) {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');
      
      if (isImage && file.size > 500 * 1024) {
        req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        res.status(400);
        throw new Error(`Image size must be less than 500KB. (${file.originalname} is ${(file.size / 1024).toFixed(1)}KB)`);
      }
      
      if (isVideo && file.size > 100 * 1024 * 1024) {
        req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        res.status(400);
        throw new Error(`Video size must be less than 100MB. (${file.originalname} is ${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
      }
    }

    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const thumbFile = thumbFiles.find(t => t.fieldname === `thumbnail_${i}`);

      try {
        const { fileKey, contentType } = await uploadToR2(file);
        
        let thumbnailKey = undefined;
        if (thumbFile) {
          const thumbUpload = await uploadToR2(thumbFile);
          thumbnailKey = thumbUpload.fileKey;
        }

        let determinedType = 'document';
        if (contentType.startsWith('image/')) {
          determinedType = 'image';
        } else if (contentType.startsWith('video/')) {
          determinedType = 'video';
        } else {
          const ext = file.originalname.toLowerCase();
          if (ext.endsWith('.skp') || ext.endsWith('.dwg') || ext.endsWith('.dxf') || ext.endsWith('.obj') || ext.endsWith('.fbx')) {
            determinedType = 'model';
          } else {
            determinedType = 'document'; // pdf, zip fallback
          }
        }

        const calculatedExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

        const media = new Media({
          projectId,
          categoryId,
          mediaType: determinedType,
          mediaStage,
          fileKey: fileKey, // Our R2 'fileKey' identifier
          thumbnailKey: thumbnailKey,
          caption: caption || '',
          originalFileName: file.originalname,
          fileExtension: calculatedExtension,
          mimeType: contentType,
        });

        // Generate the strict Internal Proxy URL mapping natively utilizing the synchronously generated ObjID
        const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
        media.mediaUrl = `${BASE_URL}/api/media/${media._id}/stream`;
        
        // Single atomic atomic db commit bypassing initial empty string Mongoose validators
        await media.save();

        uploadedMediaData.push(media);

      } catch (uploadError) {
        console.error("Single File R2 Push Error:", uploadError);
      } finally {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        if (thumbFile && fs.existsSync(thumbFile.path)) fs.unlinkSync(thumbFile.path);
      }
    }

    res.status(201).json(uploadedMediaData);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload project cover image (Direct upload to R2, returns URL)
// @route   POST /api/upload/cover
// @access  Private
export const uploadProjectCover = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image uploaded');
    }

    const file = req.file;
    if (file.mimetype.startsWith('image/') && file.size > 500 * 1024) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      res.status(400);
      throw new Error(`Image must be less than 500KB. (${(file.size / 1024).toFixed(1)}KB uploaded)`);
    }

    try {
      const { fileKey } = await uploadToR2(req.file);
      // Generate the internal proxy URL natively to bypass strict S3 Auth restrictions
      const proxyUrl = `/api/media/cover/${fileKey}`;
      res.status(201).json({ url: proxyUrl });
    } finally {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Stream View-Only Project Cover
// @route   GET /api/media/cover/:fileKey
// @access  Public
export const downloadCover = async (req, res, next) => {
  try {
    const { fileKey } = req.params;

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileKey
    });

    try {
      const response = await r2Client.send(command);
      
      // Inject STRICT security and performance headers
      res.setHeader('Content-Type', response.ContentType || 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', `inline; filename="${fileKey}"`);
      
      if (response.ContentLength) {
        res.setHeader('Content-Length', response.ContentLength.toString());
      }
      
      response.Body.pipe(res);

    } catch (err) {
      if (err.name === 'NoSuchKey') {
        return res.status(404).json({ message: 'Cover visually deleted from remote storage' });
      }
      console.error("Stream R2 Cover Error: ", err.message);
      res.status(500).json({ message: 'Internal Storage Error' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (media) {
      console.log(`[Media Deletion] Initiating delete for Media ID: ${media._id}`);
      
      // Delete strictly from Cloudflare R2
      try {
        console.log(`[R2 Sync] Deleting Primary FileKey: ${media.fileKey}`);
        await r2Client.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: media.fileKey // Our stored R2 FileKey
        }));
      } catch (r2Error) {
        console.warn(`[R2 Warning] Could not delete primary file ${media.fileKey}:`, r2Error.message);
      }

      // Verify and delete thumbnail if present
      if (media.thumbnailKey) {
        try {
          console.log(`[R2 Sync] Deleting Thumbnail FileKey: ${media.thumbnailKey}`);
          await r2Client.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: media.thumbnailKey
          }));
        } catch (r2Error) {
          console.warn(`[R2 Warning] Could not delete thumbnail ${media.thumbnailKey}:`, r2Error.message);
        }
      }

      // Delete from DB strictly
      await media.deleteOne();
      console.log(`[DB Sync] Successfully removed Media ID: ${media._id} from database.`);
      
      res.json({ message: 'Media removed from R2 and Database' });
    } else {
      res.status(404);
      throw new Error('Media not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Stream View-Only Media
// @route   GET /api/media/:id/stream
// @access  Public (Protected via View-Only constraints)
export const downloadMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      res.status(404);
      throw new Error('Media not found');
    }

    // 1. Pass down browser Range requests internally to S3 engine
    const range = req.headers.range;
    
    const getParams = {
      Bucket: process.env.R2_BUCKET,
      Key: media.fileKey
    };

    if (range) {
      getParams.Range = range;
    }

    const command = new GetObjectCommand(getParams);

    try {
      const response = await r2Client.send(command);
      
      const filename = media.originalFileName || media.fileKey;
      
      // Inject STRICT security and performance headers
      const strictMime = media.mimeType || mime.lookup(media.fileKey) || 'application/octet-stream';
      res.setHeader('Content-Type', strictMime);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`); // inline ensures the browser TRIES to display it
      res.setHeader('X-Content-Type-Options', 'nosniff'); // prevent guessing mimetype exploits
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache aggressively for 1 year to drastically reduce R2 calls

      // Forward Partial Content protocol when a range was issued
      if (range) {
        res.status(206);
        if (response.ContentRange) {
           res.setHeader('Content-Range', response.ContentRange);
        }
      } else {
        res.status(200);
      }

      // Support Range Requests seamlessly for Video Chunk playback smoothly
      if (response.ContentLength) {
        res.setHeader('Content-Length', response.ContentLength.toString());
      }
      res.setHeader('Accept-Ranges', 'bytes');
      
      // Pipe the body precisely bypassing node memory caps
      response.Body.pipe(res);

    } catch (err) {
      if (err.name === 'NoSuchKey') {
         return res.status(404).send("File not found on remote storage. It may have been manually deleted.");
      }
      console.error("Stream R2 Error: ", err.message);
      res.status(500).send("Error streaming the file from R2.");
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Get all media for a specific category string across all projects (mapped by keywords)
// @route   GET /api/media/category/:categoryName
// @access  Public
export const getMediaByCategoryName = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    
    // 1. Establish keyword mappings for flexible matching
    const nameLower = categoryName.toLowerCase();
    let regexPattern = categoryName; // default to whatever was passed

    if (nameLower.includes('bedroom')) {
      regexPattern = 'bedroom|bed room';
    } else if (nameLower.includes('living room')) {
      regexPattern = 'living room|living area|lounge';
    } else if (nameLower.includes('kitchen')) {
      regexPattern = 'kitchen';
    } else if (nameLower.includes('bathroom') || nameLower.includes('washroom')) {
      regexPattern = 'bathroom|washroom';
    } else if (nameLower.includes('dining')) {
      regexPattern = 'dining';
    } else if (nameLower.includes('office') || nameLower.includes('workspace')) {
      regexPattern = 'office|study|workspace';
    }

    // 2. Find all Category docs that match ANY variation in the pattern (substring match)
    const categories = await Category.find({
      categoryName: { $regex: new RegExp(regexPattern, 'i') }
    });

    const categoryIds = categories.map(cat => cat._id);

    if (categoryIds.length === 0) {
      return res.json([]);
    }

    // Find all Media that belong to those category IDs
    const media = await Media.find({ categoryId: { $in: categoryIds } })
      .populate('projectId', 'title location')
      .sort({ createdAt: -1 });

    res.json(media);
  } catch (error) {
    next(error);
  }
};

// @desc    Advanced DB-to-R2 Synchronization Cleanup Job
// @route   POST /api/media/cleanup
// @access  Private (Admin only)
export const cleanupOrphans = async (req, res, next) => {
  try {
    console.log("[Cleanup] Starting Advanced Synchronization Sweeper...");
    
    // 1. Gather all legitimate keys from the Database
    const allMedia = await Media.find({}, 'fileKey thumbnailKey');
    const allProjects = await Project.find({}, 'coverImage');
    
    const validKeys = new Set();
    
    allMedia.forEach(m => {
      if (m.fileKey) validKeys.add(m.fileKey);
      if (m.thumbnailKey) validKeys.add(m.thumbnailKey);
    });
    
    allProjects.forEach(p => {
      if (p.coverImage && p.coverImage !== 'placeholder.jpg') {
        const coverKey = p.coverImage.split('/').pop();
        if (coverKey) validKeys.add(coverKey);
      }
    });

    console.log(`[Cleanup] Database currently expects ${validKeys.size} distinct files.`);

    // 2. Fetch all keys currently living inside the R2 Bucket
    const bucketParams = { Bucket: process.env.R2_BUCKET };
    let isTruncated = true;
    const r2Keys = new Set();
    let continuationToken = undefined;
    
    while (isTruncated) {
      if (continuationToken) bucketParams.ContinuationToken = continuationToken;
      const response = await r2Client.send(new ListObjectsV2Command(bucketParams));
      if (response.Contents) {
        response.Contents.forEach(item => {
           if (item.Key) r2Keys.add(item.Key);
        });
      }
      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }
    
    console.log(`[Cleanup] Cloudflare R2 currently holds ${r2Keys.size} files in the bucket.`);

    const deletedFromR2 = [];
    const deletedFromDB = [];

    // 3. Find Orphans in R2 (Files in R2 that DB doesn't point to)
    for (const r2Key of r2Keys) {
      if (!validKeys.has(r2Key)) {
        try {
          await r2Client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: r2Key }));
          deletedFromR2.push(r2Key);
          console.log(`[Cleanup] Swept Orphan R2 File: ${r2Key}`);
        } catch (err) {
          console.error(`[Cleanup] Failed to sweep Orphan R2 File ${r2Key}:`, err.message);
        }
      }
    }

    // 4. Find Broken Links in DB (Media records pointing to missing R2 fileKeys)
    for (const media of allMedia) {
      let isBroken = false;
      if (media.fileKey && !r2Keys.has(media.fileKey)) isBroken = true;
      
      if (isBroken) {
        await Media.deleteOne({ _id: media._id });
        deletedFromDB.push(media._id);
        console.log(`[Cleanup] Swept Broken DB Record: ${media._id}`);
      }
    }

    console.log(`[Cleanup] Advanced Synchronization Complete.`);
    
    res.json({
      message: 'Advanced Cleanup Synchronization Complete',
      stats: {
        totalR2FilesSweeped: deletedFromR2.length,
        totalDBRecordsPurged: deletedFromDB.length,
        orphanedR2Keys: deletedFromR2,
        brokenDBIds: deletedFromDB
      }
    });

  } catch (error) {
    next(error);
  }
};
