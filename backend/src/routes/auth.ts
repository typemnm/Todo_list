import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'stellar-observer-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'stellar-observer-refresh-secret-change-in-production';

function generateTokens(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { token, refreshToken };
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
      return;
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }
    const user = await User.create({ email, password });
    const { token, refreshToken } = generateTokens(user._id.toString());
    res.status(201).json({
      success: true,
      data: { token, refreshToken, user: { _id: user._id, email: user.email } },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }
    const { token, refreshToken } = generateTokens(user._id.toString());
    res.json({
      success: true,
      data: { token, refreshToken, user: { _id: user._id, email: user.email } },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: 'Refresh token required' });
      return;
    }
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    const token = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, data: { token } });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
});

export default router;
