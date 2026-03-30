import { Router, Response } from 'express';
import { Todo } from '../models/Todo';
import mongoose from 'mongoose';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, priority, completed, page = '1', limit = '20' } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(req.userId) };

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (priority && ['low', 'medium', 'high'].includes(priority)) filter.priority = priority;
    if (completed !== undefined && completed !== '') filter.completed = completed === 'true';

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [todos, total] = await Promise.all([
      Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Todo.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: todos,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('Get todos error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, priority } = req.body;
    if (!title || title.trim() === '') {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }
    if (title.length > 200) {
      res.status(400).json({ success: false, error: 'Title cannot exceed 200 characters' });
      return;
    }
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      res.status(400).json({ success: false, error: 'Invalid priority value' });
      return;
    }
    const todo = await Todo.create({ title: title.trim(), priority, userId: new mongoose.Types.ObjectId(req.userId) });
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    console.error('Create todo error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, error: 'Invalid todo ID' });
      return;
    }
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (err) {
    console.error('Toggle todo error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, error: 'Invalid todo ID' });
      return;
    }
    const { title, priority } = req.body;
    const updates: Record<string, unknown> = {};
    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400).json({ success: false, error: 'Title cannot be empty' });
        return;
      }
      if (title.length > 200) {
        res.status(400).json({ success: false, error: 'Title cannot exceed 200 characters' });
        return;
      }
      updates.title = title.trim();
    }
    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        res.status(400).json({ success: false, error: 'Invalid priority value' });
        return;
      }
      updates.priority = priority;
    }
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: todo });
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, error: 'Invalid todo ID' });
      return;
    }
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    console.error('Delete todo error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
