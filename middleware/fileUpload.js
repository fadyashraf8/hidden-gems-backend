import multer from 'multer';
import { AppError } from '../utils/AppError.js';





const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});


// للـ multiple files مع Cloudinary
const uploadMultiple = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("images only", 400), false);
    }
  }
});

export const uploadMultipleFiles = (arrayOfFields) => {
  return uploadMultiple.fields(arrayOfFields);
};
export default upload;