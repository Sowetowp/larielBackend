import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config({path: "./config/.env"});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

export const uploadImagesToCloudinary = (images) => {
  return new Promise((resolve, reject) => {
    const promises = images.map((image) => {
      return new Promise((innerResolve, innerReject) => {
        cloudinary.uploader.upload(
          image,
          {
            upload_preset: "unsigned_upload",
            allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
          },
          (error, result) => {
            if (error) {
              innerReject(error);
            } else {
              innerResolve(result);
            }
          }
        );
      });
    });

    Promise.all(promises)
      .then((results) => {
        resolve(results);
      })
      .catch((error) => {
        reject(error);
      });
  });
};