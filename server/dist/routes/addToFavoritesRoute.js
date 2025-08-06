import express from 'express';
import { addToFavoritesController } from '../controllers/addToFavoritesController.js';
import { favoriteController } from '../controllers/favoriteController.js';
const router = express.Router();
router.post('/', addToFavoritesController);
router.get('/:product', favoriteController);
export default router;
