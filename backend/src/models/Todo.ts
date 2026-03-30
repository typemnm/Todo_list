import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const todoSchema = new Schema<ITodo>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true,
    validate: {
      validator: (value: string) => value.length > 0,
      message: 'Title cannot be empty',
    },
  },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
});

export const Todo = (mongoose.models['Todo'] as mongoose.Model<ITodo>) || mongoose.model<ITodo>('Todo', todoSchema);
