import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { createApp } from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = createApp();

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;
