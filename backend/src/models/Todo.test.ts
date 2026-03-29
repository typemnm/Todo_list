import mongoose from 'mongoose';
import { Todo, ITodo } from './Todo';

describe('Todo Model', () => {
  describe('Validation', () => {
    it('should create todo with title and default values', async () => {
      const todo = await Todo.create({ title: 'Test Todo' });
      
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
      expect(todo.priority).toBe('medium');
      expect(todo.createdAt).toBeInstanceOf(Date);
    });

    it('should reject empty title', async () => {
      await expect(Todo.create({ title: '' })).rejects.toThrow();
    });

    it('should reject missing title', async () => {
      await expect(Todo.create({})).rejects.toThrow();
    });

    it('should reject title exceeding 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      await expect(Todo.create({ title: longTitle })).rejects.toThrow();
    });

    it('should trim whitespace from title', async () => {
      const todo = await Todo.create({ title: '  Test Todo  ' });
      expect(todo.title).toBe('Test Todo');
    });
  });

  describe('Priority Field', () => {
    it('should accept priority: low', async () => {
      const todo = await Todo.create({ title: 'Test', priority: 'low' });
      expect(todo.priority).toBe('low');
    });

    it('should accept priority: medium', async () => {
      const todo = await Todo.create({ title: 'Test', priority: 'medium' });
      expect(todo.priority).toBe('medium');
    });

    it('should accept priority: high', async () => {
      const todo = await Todo.create({ title: 'Test', priority: 'high' });
      expect(todo.priority).toBe('high');
    });

    it('should default priority to medium', async () => {
      const todo = await Todo.create({ title: 'Test' });
      expect(todo.priority).toBe('medium');
    });

    it('should reject invalid priority', async () => {
      await expect(Todo.create({ title: 'Test', priority: 'urgent' as any })).rejects.toThrow();
    });
  });

  describe('Completed Field', () => {
    it('should default completed to false', async () => {
      const todo = await Todo.create({ title: 'Test' });
      expect(todo.completed).toBe(false);
    });

    it('should accept completed: true', async () => {
      const todo = await Todo.create({ title: 'Test', completed: true });
      expect(todo.completed).toBe(true);
    });
  });

  describe('Timestamp', () => {
    it('should have createdAt timestamp', async () => {
      const before = new Date();
      const todo = await Todo.create({ title: 'Test' });
      const after = new Date();
      
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(todo.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
