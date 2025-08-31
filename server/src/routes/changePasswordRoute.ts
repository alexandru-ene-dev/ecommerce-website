import express from 'express';
import { changePasswordController } from '../controllers/changePasswordController.js';

const router = express.Router();

router.post('/', changePasswordController);

export default router;