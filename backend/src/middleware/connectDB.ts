import { Request, Response, NextFunction } from 'express';
import { connectDB } from '../config/database';

export async function connectDBMiddleware(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}
