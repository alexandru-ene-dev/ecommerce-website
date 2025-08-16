import express from 'express';
import { fetchProductsController } from '../controllers/fetchProductsController.js';
const router = express.Router();
router.get('/:subcategory', fetchProductsController);
router.get('/:subcategory/:subSubcategory', fetchProductsController);
export default router;
