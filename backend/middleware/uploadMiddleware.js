import multer from 'multer';
import path from 'path';

// Store permanently on disk temporarily before pushing to Cloudflare R2
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists in the backend root
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log(`Filtering file: ${file.originalname}, mimetype: ${file.mimetype}`);
  
  // Accept standard modern images & videos
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/jpg',
    'video/mp4', 'video/quicktime', 'video/webm',
    'application/pdf', 'application/zip', 'application/x-zip-compressed'
  ];
  
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.webm', '.pdf', '.zip', '.dwg', '.dxf', '.skp'];

  if ((allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('video/')) && allowedExtensions.includes(ext)) {
    return cb(null, true);
  }

  // Permissive fallback for obscure CAD types where mimetype doesn't match standard headers
  if (['.dwg', '.dxf', '.skp', '.zip'].includes(ext)) {
     return cb(null, true);
  }

  cb(new Error(`Invalid file type. Received: ${file.mimetype} (Ext: ${ext})`), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB strict absolute limit
  },
});

export default upload;
