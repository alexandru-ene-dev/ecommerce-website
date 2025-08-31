import multer from 'multer';
import type { Request } from 'express';
import { FileFilterCallback } from 'multer';
import path from 'path';


export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};


export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});