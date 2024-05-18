import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config({ path: "./config/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

export const uploadImagesToCloudinary = async (images) => {
  try {
    const promises = images.map((image) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          image,
          {
            upload_preset: "unsigned_upload",
            allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      })
    );

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw error;
  }
};

export const deleteImagesFromCloudinary = async (images) => {
  try {
    const promises = images.map((image) =>
      new Promise((resolve, reject) => {
        console.log(`Attempting to delete image with id: ${image.id}`);
        cloudinary.uploader.destroy(image.id, (error, result) => {
          if (error) {
            console.error(`Error deleting image with id ${image.id}:`, error);
            reject(error);
          } else {
            console.log(`Result of deleting image with id ${image.id}:`, result);
            resolve(result);
          }
        });
      })
    );

    const results = await Promise.all(promises);
    console.log('All delete operations completed:', results);
    return results;
  } catch (error) {
    console.error('Error in deleteImagesFromCloudinary:', error);
    throw error;
  }
};