import { Request, Response } from "express";
import UserModel from "../models/UserSchema.js";


const deleteAccountController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (req?.user?.id) {
      if (req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Cannot delete this account',
        });
      }
    }

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${err}`,
    });
  }
};

export { deleteAccountController };
