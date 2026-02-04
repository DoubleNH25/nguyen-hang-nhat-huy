import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/tasks.db');

export class Database {
  private db: sqlite3.Database;

  constructor() {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
      }
      console.log('Connected to SQLite database');
    });
    
    this.initializeTables();
  }

  private initializeTables(): void {
    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        due_date TEXT
      )
    `;

    this.db.run(createTasksTable, (err) => {
      if (err) {
        console.error('Error creating tasks table:', err.message);
      } else {
        console.log('Tasks table ready');
      }
    });
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export const database = new Database();