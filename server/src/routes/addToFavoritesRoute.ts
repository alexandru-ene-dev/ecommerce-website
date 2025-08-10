import express from 'express';
import { addToFavoritesController } from '../controllers/addToFavoritesController.js';
import { favoriteController } from '../controllers/favoriteController.js';
import { getAllFavController } from '../controllers/getAllFavController.js';

const router = express.Router();
router.post('/', addToFavoritesController);
router.get('/all', getAllFavController);
router.get('/:product', favoriteController);
// router.get('/:', favoriteController);

export default router;