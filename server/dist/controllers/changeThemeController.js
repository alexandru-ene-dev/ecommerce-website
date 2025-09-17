import UserModel from '../models/UserSchema.js';
export const changeThemeController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const theme = req.body.theme;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing User ID'
            });
        }
        if (!theme) {
            return res.status(400).json({
                success: false,
                message: 'Missing theme from request'
            });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        user.theme = theme;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Theme changed',
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${err}`
        });
    }
};
