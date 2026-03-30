import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

interface ITodo {
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const TodoSchema = new mongoose.Schema<ITodo>({
  title: { type: String, required: true, maxlength: 200 },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
});

const Todo = (mongoose.models['Todo'] as mongoose.Model<ITodo>) || mongoose.model<ITodo>('Todo', TodoSchema);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not defined');
  
  await mongoose.connect(uri);
  isConnected = true;
}

app.get('/api/todos', async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch todos' });
  }
});

app.post('/api/todos', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { title, priority = 'medium' } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    if (title.length > 200) {
      return res.status(400).json({ success: false, error: 'Title must be 200 characters or less' });
    }
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid priority' });
    }
    
    const todo = await Todo.create({ title: title.trim(), priority });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create todo' });
  }
});

app.patch('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }
    
    todo.completed = !todo.completed;
    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update todo' });
  }
});

app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }
    
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }
    
    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete todo' });
  }
});

export default app;
