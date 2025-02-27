import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => {
    return {
      folder: 'CloudinaryDemo',
      allowedFormats: ['jpeg', 'png', 'jpg'],
    };
  },
});

export const upload = multer({ storage });
