import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const FileUploadeToColoudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    fs.unlinkSync(filePath); // Remove from local
    return result;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw error;
  }
};
