import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// Extend Request interface để thêm user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      }
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.status(404).json({ message: 'Access token required' });
      return;
    }
    const decode = jwt.verify(token, config.jwtSecret) as { _id: string;};
    req.user = decode;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

