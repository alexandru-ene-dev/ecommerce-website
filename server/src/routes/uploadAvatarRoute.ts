import express from 'express';
import { uploadAvatarController } from '../controllers/uploadAvatarController.js';
import { getAvatarController } from '../controllers/getAvatarController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { deleteAvatarController } from '../controllers/deleteAvatarController.js';

const router = express.Router();

// Endpoint for updating avatar
router.post('/:id/avatar', upload.single('image'), uploadAvatarController);
router.get('/:id/avatar', getAvatarController);
router.delete('/:id/avatar', deleteAvatarController);

export default router;