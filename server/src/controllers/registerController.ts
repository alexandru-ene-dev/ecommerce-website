import { RegisterUserInputsSchema, type RegisterUserInput } from '../schemas/authSchema.js';
import { Request, Response } from 'express';
import User from '../models/UserSchema.js';

export const registerController = async (
  req: Request<{}, {}, RegisterUserInput>, 
  res: Response
) => {
  const result = RegisterUserInputsSchema.safeParse(req.body);

  if (!result.success) {
    const errorMessage = result.error.issues.map(err => err.message);
    return res.status(400).json({ success: false, message: errorMessage });
  }

  const { firstName, lastName, email, password } = result.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ 
      success: false, 
      message: 'User already exists' 
    });
  }

  const newUser = new User({
    firstName,
    lastName,
    email,
    password
  });

  try {
    await newUser.save();
  
    res.status(201).json({ 
      success: true, 
      message: `Successfully created a new account`, 
    });
  } catch (err) {
    console.error('Error creating user', err as Error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });

  }
};