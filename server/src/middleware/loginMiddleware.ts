import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: MISSING JWT SECRET KEY');
  process.exit(1);
}

const loginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers['authorization'];
  
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token not provided or malformed (e.g., missing "Bearer" prefix)'
      });
    }

    const token = authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid token'
      });
    }

    jwt.verify(token, JWT_SECRET as string, (err, user) => {
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
        req.user = user as Express.Request['user'];
      } else {
        return res.status(500).json({
          success: false,
          message: 'Authentication failed: Malformed user payload in token'
        }); 
      }

      next();
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal error occurred during authentication'
    });
  }
  
};

export default loginMiddleware;