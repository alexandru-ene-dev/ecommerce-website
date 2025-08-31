import UserModel from '../models/UserSchema.js';
const getAvatarController = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user || !user.avatar) {
            return res.status(404).json({
                success: false,
                message: 'No avatar found'
            });
        }
        // res.set('Content-Type', user.avatarMimeType || 'image/png');
        const base64Avatar = user.avatar.toString('base64');
        return res.status(200).json({
            success: true,
            message: 'Avatar retrieved successfully',
            avatar: base64Avatar
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error retrieving avatar: ${err}`
        });
    }
};
export { getAvatarController };
