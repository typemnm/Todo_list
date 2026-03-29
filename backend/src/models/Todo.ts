import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true,
    validate: {
      validator: (value: string) => value.length > 0,
      message: 'Title cannot be empty'
    }
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Todo = mongoose.model<ITodo>('Todo', todoSchema);
