import express from 'express';
import { addToFavoritesController } from '../controllers/addToFavoritesController.js';
import { clearFavoritesController } from '../controllers/clearFavoritesController.js';
const router = express.Router();
router.post('/', addToFavoritesController);
router.delete('/', clearFavoritesController);
export default router;
