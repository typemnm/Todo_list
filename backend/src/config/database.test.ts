import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from './database';

describe('Database Configuration', () => {
  let mongoServer: MongoMemoryServer;
  
  beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null as any;
    }
  });

  describe('connectDB', () => {
    it('should connect to MongoDB successfully with valid URI', async () => {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      process.env.MONGODB_URI = mongoUri;

      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should throw error when MONGODB_URI is not defined', async () => {
      delete process.env.MONGODB_URI;
      
      await expect(connectDB()).rejects.toThrow('MONGODB_URI environment variable is not defined');
    });

    it('should handle connection errors gracefully', async () => {
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/testdb?connectTimeoutMS=1000&serverSelectionTimeoutMS=1000';
      
      await expect(connectDB()).rejects.toThrow();
    }, 10000);
  });

  describe('disconnectDB', () => {
    it('should disconnect from MongoDB successfully', async () => {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      process.env.MONGODB_URI = mongoUri;

      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);

      await disconnectDB();
      expect(mongoose.connection.readyState).toBe(0);
    });
  });
});
