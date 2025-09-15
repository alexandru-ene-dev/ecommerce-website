import express from 'express';
import { productsController } from '../controllers/productsController.js';
import { searchProductsController } from '../controllers/searchProductsController.js';

const router = express.Router();

router.get('/search', searchProductsController);
router.get('/:name', productsController);

export default router;
