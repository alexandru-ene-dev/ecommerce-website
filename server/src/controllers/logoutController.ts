import type { Request, Response } from 'express';

const logoutController = (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'You have been logged out'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${err}`
    });
  }
};

export { logoutController };