import dotenv from 'dotenv'


dotenv.config()
import { v2 as cloudinary } from "cloudinary";




// cloudinary.config({
//   cloud_name: "dpgdllowo",
//   api_key: "845638656935418",
//   api_secret: "6PGL4Idl-BORIbOFA5uNL_IEEjU",
// });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder = "books") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          // console.error("Cloudinary stream error:", error);
          reject(error);
        } else {
          // console.log("Cloudinary upload result:", result.secure_url);
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

export { uploadToCloudinary };
export default cloudinary;