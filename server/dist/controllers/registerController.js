import { RegisterUserInputsSchema } from '../schemas/authSchema.js';
export const registerController = (req, res) => {
    const result = RegisterUserInputsSchema.safeParse(req.body);
    if (!result.success) {
        const errorMessage = result.error.issues.map(err => err.message);
        return res.status(400).json({ success: false, message: errorMessage });
    }
    const { firstName, lastName, email, password, confirmPass } = result.data;
    res.status(200).json({
        success: true,
        message: `Hello, new user!`,
        info: firstName + ' ' + lastName
    });
};
