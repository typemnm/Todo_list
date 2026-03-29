import { Router, Request, Response } from 'express';
import { Todo } from '../models/Todo';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
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

    const todo = await Todo.create({ title: title.trim(), priority });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, error: 'Invalid todo ID' });
      return;
    }

    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, error: 'Invalid todo ID' });
      return;
    }

    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
