import multer from 'multer';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    callback(null, ALLOWED_MIME_TYPES.has(file.mimetype));
  },
});
