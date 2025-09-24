import express from "express";
import { deleteAccountController } from "../controllers/deleteAccountController.js";
import loginMiddleware from "../middleware/loginMiddleware.js";

const router = express.Router();

router.delete('/:id', loginMiddleware, deleteAccountController);

export default router;