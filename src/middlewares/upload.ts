import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'system_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  } as any,
});

export const upload = multer(
  { 
    storage, 
    limits: { 
      fileSize: 100 * 1024 * 1024 
    }
  }
);
