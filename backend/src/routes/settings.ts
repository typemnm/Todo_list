import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { UserSettings } from '../models/UserSettings';
import mongoose from 'mongoose';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await UserSettings.findOne({ userId: req.userId });
    if (!settings) {
      settings = await UserSettings.create({ userId: new mongoose.Types.ObjectId(req.userId) });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.put('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { starBrightness, glowIntensity, connectionLines, nebulaEffects, animationSpeed } = req.body;
    const updates: Record<string, unknown> = {};
    if (starBrightness !== undefined) updates.starBrightness = Math.max(0, Math.min(100, Number(starBrightness)));
    if (glowIntensity !== undefined) updates.glowIntensity = Math.max(0, Math.min(100, Number(glowIntensity)));
    if (connectionLines !== undefined) updates.connectionLines = Boolean(connectionLines);
    if (nebulaEffects !== undefined) updates.nebulaEffects = Boolean(nebulaEffects);
    if (animationSpeed !== undefined) updates.animationSpeed = Math.max(0, Math.min(100, Number(animationSpeed)));
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
