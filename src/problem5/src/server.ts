import app from './app';
import { database } from './config/database';
import path from 'path';
import fs from 'fs';

const PORT = process.env.PORT || 3000;


const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}


const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  database.close();
  
  process.exit(0);
};


process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});


const server = app.listen(PORT, () => {
  console.log(`
🚀 Task Management API Server Started
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health Check: http://localhost:${PORT}/health
📚 API Base URL: http://localhost:${PORT}/api/tasks
⏰ Started at: ${new Date().toISOString()}
  `);
});

export default server;