import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../Models/DbModels';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: 'Unauthorized - no token found' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized - invalid or expired token' });
  }
};

export { authMiddleware };