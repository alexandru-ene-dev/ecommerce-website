import express from 'express';
import { addToCartController } from '../controllers/addToCartController.js';
import { clearCartController } from '../controllers/clearCartController.js';


const router = express.Router();
router.post('/', addToCartController);
router.delete('/', clearCartController);

export default router;