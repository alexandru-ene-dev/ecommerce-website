import { RegisterUserInputsSchema, type RegisterUserInput } from '../schemas/authSchema.js';
import { Request, Response } from 'express';
import User from '../models/UserSchema.js';
import generateToken from '../utils/jwt.js';


type CookieOptions = {
  httpOnly: boolean,
  secure: true,
  sameSite: 'strict' | 'none' | 'lax'
  maxAge?: number
};


export const registerController = async (
  req: Request<{}, {}, RegisterUserInput>, 
  res: Response
) => {
  try {
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

    const { keepMeLogged } = req.body;

    // create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password
    });


    // generate token
    const payload = {
      id: newUser._id.toString(),
      email: newUser.email
    };

    const token = generateToken(payload);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    if (keepMeLogged) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000 //  7 days in ms
    }

    res
      .cookie('token', token, cookieOptions)
      .status(201)
      .json({ 
        success: true, 
        message: 'Successfully created a new account',
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        } 
      });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: `Internal server error: ${err}` 
    });
  }
};