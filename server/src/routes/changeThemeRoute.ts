import express from 'express';
import { changeThemeController } from '../controllers/changeThemeController.js';

const router = express.Router();

router.post('/', changeThemeController);

export default router;