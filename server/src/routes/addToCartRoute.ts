import express from 'express';
import { addToCartController } from '../controllers/addToCartController.js';

const router = express.Router();

router.post('/', addToCartController);

export default router;