import type { Request, Response } from 'express';
import UserModel from '../models/UserSchema.js';

const uploadAvatarController = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image uploaded' 
      });
    }

    user.avatar = req.file.buffer; // the binary image data
    user.avatarMimeType = req.file.mimetype; // e.g., image/png

    await user.save();

    res.json({ 
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: user.avatar 
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: `Internal server error occurred: ${err}` 
    });
  }
};

export { uploadAvatarController };