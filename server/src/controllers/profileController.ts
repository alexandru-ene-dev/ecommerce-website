import type { Request, Response } from 'express';

type reqBody = {
  email: string
}

export const profileController = (
  req: Request<{}, {}, reqBody>, 
  res: Response 
) => {
  const { email } = req.body;
  let username: string;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email required'
    });
  }

  username = email.split('@')[0];

  return res.status(200).json({
    success: true,
    message: 'Hello' + username
  });
};