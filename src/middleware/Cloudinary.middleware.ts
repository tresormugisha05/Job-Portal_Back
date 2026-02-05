import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/Cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "docx", "doc"],
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
})
