import type { Request, Response } from 'express';
import UserModel from '../models/UserSchema.js';


const clearCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found'
      });
    }

    user.cart = [];

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Cart products have been cleared',
    });

  } catch (err) {
    return {
      success: false,
      message: `Internal server error: ${err}`
    }
  }
};

export { clearCartController };