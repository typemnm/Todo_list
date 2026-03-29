import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { Todo } from '../models/Todo';
import todosRouter from './todos';

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/api/todos', todosRouter);
});

describe('GET /api/todos', () => {
  it('should return empty array when no todos', async () => {
    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
  });

  it('should return all todos', async () => {
    await Todo.create([
      { title: 'Todo 1', priority: 'high' },
      { title: 'Todo 2', priority: 'low' },
      { title: 'Todo 3' }
    ]);

    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(3);
  });

  it('should return todos sorted by createdAt desc', async () => {
    const todo1 = await Todo.create({ title: 'First' });
    await new Promise(resolve => setTimeout(resolve, 10));
    const todo2 = await Todo.create({ title: 'Second' });
    await new Promise(resolve => setTimeout(resolve, 10));
    const todo3 = await Todo.create({ title: 'Third' });

    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(response.body.data[0].title).toBe('Third');
    expect(response.body.data[1].title).toBe('Second');
    expect(response.body.data[2].title).toBe('First');
  });
});

describe('POST /api/todos', () => {
  it('should create todo with valid title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'New Todo' });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('New Todo');
    expect(response.body.data.completed).toBe(false);
    expect(response.body.data.priority).toBe('medium');
  });

  it('should create todo with priority', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'High Priority Todo', priority: 'high' });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.priority).toBe('high');
  });

  it('should default priority to medium', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Default Priority' });
    
    expect(response.status).toBe(201);
    expect(response.body.data.priority).toBe('medium');
  });

  it('should return 400 for empty title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '' });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Title is required');
  });

  it('should return 400 for missing title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Title is required');
  });

  it('should return 400 for title exceeding 200 characters', async () => {
    const longTitle = 'a'.repeat(201);
    const response = await request(app)
      .post('/api/todos')
      .send({ title: longTitle });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Title cannot exceed 200 characters');
  });

  it('should return 400 for invalid priority', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Test', priority: 'urgent' });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid priority value');
  });

  it('should trim whitespace from title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '  Trimmed Todo  ' });
    
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Trimmed Todo');
  });
});

describe('PATCH /api/todos/:id', () => {
  it('should toggle completed status from false to true', async () => {
    const todo = await Todo.create({ title: 'Test Todo' });
    
    const response = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send();
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.completed).toBe(true);
  });

  it('should toggle completed status from true to false', async () => {
    const todo = await Todo.create({ title: 'Test Todo', completed: true });
    
    const response = await request(app)
      .patch(`/api/todos/${todo._id}`)
      .send();
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.completed).toBe(false);
  });

  it('should return 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .patch(`/api/todos/${fakeId}`)
      .send();
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Todo not found');
  });

  it('should return 400 for invalid ObjectId', async () => {
    const response = await request(app)
      .patch('/api/todos/invalid-id')
      .send();
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid todo ID');
  });
});

describe('DELETE /api/todos/:id', () => {
  it('should delete existing todo', async () => {
    const todo = await Todo.create({ title: 'To Delete' });
    
    const response = await request(app)
      .delete(`/api/todos/${todo._id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeNull();
    
    const deleted = await Todo.findById(todo._id);
    expect(deleted).toBeNull();
  });

  it('should return 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .delete(`/api/todos/${fakeId}`);
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Todo not found');
  });

  it('should return 400 for invalid ObjectId', async () => {
    const response = await request(app)
      .delete('/api/todos/invalid-id');
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid todo ID');
  });
});
