import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_CLOUD_KEY,
  api_secret: process.env.API_CLOUD_SECRET,
});
export { cloudinary };
