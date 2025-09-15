import express from 'express';
import { syncController } from '../controllers/syncController.js';

const router = express.Router();

router.post('/', syncController);

export default router;