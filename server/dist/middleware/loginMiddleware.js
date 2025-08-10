import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.SECRET_KEY;
if (!JWT_SECRET) {
    console.error('FATAL ERROR: MISSING JWT SECRET KEY');
    process.exit(1);
}
const loginMiddleware = (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies?.token;
        const authorization = req.headers['authorization'];
        const tokenFromHeader = authorization?.startsWith('Bearer ') ? authorization?.split(' ')[1] : null;
        const token = tokenFromCookie || tokenFromHeader;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: No token provided in cookies or headers'
            });
        }
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication failed: Token has expired'
                    });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication failed: Invalid token signature or format'
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed: Invalid token'
                });
            }
            if (typeof user === 'object' && user !== null) {
                req.user = user;
            }
            else {
                return res.status(500).json({
                    success: false,
                    message: 'Authentication failed: Malformed user payload in token'
                });
            }
            next();
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal error occurred during authentication'
        });
    }
};
export default loginMiddleware;
