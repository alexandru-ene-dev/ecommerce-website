import bcrypt from 'bcryptjs';
import { LoginSchema } from '../schemas/authSchema.js';
import User from '../models/UserSchema.js';
import generateToken from '../utils/jwt.js';
export const loginController = async (req, res) => {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
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
        // generate token  
        const payload = {
            id: user._id.toString(),
            email: user.email
        };
        const token = generateToken(payload);
        return res
            .cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        })
            .status(200)
            .json({
            success: true,
            message: 'Successfully logged in!',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            message
        });
    }
};
