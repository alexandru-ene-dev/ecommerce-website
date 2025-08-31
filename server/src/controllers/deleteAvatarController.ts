import type { Request, Response } from 'express';
import UserModel from '../models/UserSchema.js';

const deleteAvatarController = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.avatar = undefined;
    user.avatarMimeType = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Avatar removed' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: `Error removing avatar: ${err}` 
    });
  }
};

export { deleteAvatarController };