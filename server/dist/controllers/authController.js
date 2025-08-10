import UserModel from '../models/UserSchema.js';
export const authController = async (req, res) => {
    try {
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing User ID'
            });
        }
        const foundUser = await UserModel.findById(userId).select('-password');
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'User found, authentication was successful',
            user: foundUser
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error fetching user info: ${err}`
        });
    }
};
