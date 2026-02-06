import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/Cloudinary";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

const profileFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG and JPEG files are allowed for profile pictures'), false);
  }
};

export const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: profileFileFilter
});