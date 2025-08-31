import type { Request, Response } from 'express';
import UserModel from '../models/UserSchema.js';
import bcrypt from 'bcryptjs';


export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { userId, currentPass, newPass, confirmPass }  = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing user ID from request'
      });
    }
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isPasswordMatch = await bcrypt.compare(currentPass, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current password'
      });
    }
    
    if (!newPass || !confirmPass) {
      return res.status(400).json({
        success: false,
        message: 'Both new password fields must be filled out'
      });
    }

    if (newPass !== confirmPass) {
      return res.status(400).json({ 
        success: false, 
        message: 'New passwords do not match' 
      });
    }

    user.password = newPass;
    await user.save();
    
    return res.status(200).json({
      success: true, 
      message: 'Password updated successfully!' 
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error changing password: ${err}`
    });
  }
}