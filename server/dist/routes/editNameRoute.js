import express from 'express';
import { editNameController } from '../controllers/editNameController.js';
const router = express.Router();
router.put('/', editNameController);
export default router;
