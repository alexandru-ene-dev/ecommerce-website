import type { Request, Response } from 'express';
import UserModel from '../models/UserSchema.js';


const syncController = async (req: Request, res: Response) => {
  try {
    const { favorites, cart, userId } = req.body;

    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Client error: missing userId from request body'
      });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found'
      });
    }

    if (Array.isArray(favorites)) {
      user.favorites = favorites;
    }

    if (Array.isArray(cart)) {
      user.cart = cart;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User data synced successfully'
    });

  } catch (err) {
    return {
      success: false,
      message: `Internal server error: ${err}`
    }
  }
};

export { syncController };