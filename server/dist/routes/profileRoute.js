import express from 'express';
import { profileController } from '../controllers/profileController.js';
const router = express.Router();
router.get('/', profileController);
export default router;
