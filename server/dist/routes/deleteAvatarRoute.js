import express from 'express';
import { deleteAvatarController } from '../controllers/deleteAvatarController.js';
const router = express.Router();
router.delete('/', deleteAvatarController);
export default router;
