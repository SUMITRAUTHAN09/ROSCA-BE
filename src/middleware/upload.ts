import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config/config.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Define params type for CloudinaryStorage
interface CloudinaryParams {
  folder: string;
  allowed_formats: string[];
  transformation: Array<{ width: number; height: number; crop: string }>;
  public_id: string;
}

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (
    req: Request,
    file: Express.Multer.File
  ): Promise<CloudinaryParams> => {
    return {
      folder: 'rosca-room-images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1500, height: 1500, crop: 'limit' }],
      public_id: `room-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
} as any); // Type assertion to bypass type issues with the library

// File filter for validation
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

// Export cloudinary instance for other operations (delete, etc.)
export { cloudinary };
