import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { LoginSchema, type LoginUserInput } from '../schemas/authSchema.js';
import User from '../models/UserSchema.js';

dotenv.config();

export const loginController = async (
  req: Request<{}, {}, LoginUserInput>, 
  res: Response
) => {
  const result = LoginSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessage = result.error.issues.map(err => err.message);
    return res.status(400).json({ 
      success: false, 
      message: errorMessage 
    });
  }

  const { email, password } = result.data;

  try {
    // check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // check pass
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const payload = { email };
    const SECRET = process.env.SECRET_KEY;

    if (!SECRET) {
      return res.status(500).json({
        success: false,
        message: 'No secret key has been found in the environment'
      });
    }
      
    const token = jwt.sign(payload, SECRET, { expiresIn: '24h' });

    return res.status(200).json({ 
      token, 
      success: 
      true, message: 'Successfully logged in!'
    });
  } catch (err) {

    const message = err instanceof Error? err.message : 'Unknown error';

    return res.status(500).json({
      success: false,
      message
    });
  }
};

