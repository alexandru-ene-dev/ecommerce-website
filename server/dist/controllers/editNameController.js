import UserModel from "../models/UserSchema.js";
const editNameController = async (req, res) => {
    try {
        const { firstName, lastName, _id } = req.body;
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing user _id from request'
            });
        }
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Missing user name from request'
            });
        }
        const user = await UserModel.findOne({ _id: _id });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        await user.updateOne({ $set: { firstName, lastName } });
        return res.status(200).json({
            success: true,
            message: 'User name edited successfully!'
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server error occurred: ${err}`
        });
    }
};
export { editNameController };
