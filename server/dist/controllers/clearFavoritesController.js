import UserModel from '../models/UserSchema.js';
const clearFavoritesController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found'
            });
        }
        user.favorites = [];
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'All favorite products have been cleared',
        });
    }
    catch (err) {
        return {
            success: false,
            message: `Internal server error: ${err}`
        };
    }
};
export { clearFavoritesController };
