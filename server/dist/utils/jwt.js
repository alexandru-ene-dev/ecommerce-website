import jwt from 'jsonwebtoken';
const generateToken = (user) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error('FATAL ERROR: SECRET_KEY MISSING FROM ENV!');
    }
    return jwt.sign(user, SECRET_KEY, { expiresIn: '7d' });
};
export default generateToken;
