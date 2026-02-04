import { v4 as uuidv4 } from 'uuid';
import { database } from '../config/database';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  TaskStatus, 
  TaskPriority,
  PaginatedResponse 
} from '../types/task.types';

export class TaskService {
  private db = database.getDatabase();

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const task: Task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      status: TaskStatus.PENDING,
      priority: taskData.priority || TaskPriority.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate
    };

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO tasks (id, title, description, status, priority, created_at, updated_at, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(
        query,
        [task.id, task.title, task.description, task.status, task.priority, task.createdAt, task.updatedAt, task.dueDate],
        function(err) {
          if (err) {
            reject(new Error(`Failed to create task: ${err.message}`));
          } else {
            resolve(task);
          }
        }
      );
    });
  }

  async getAllTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 10,
      offset = 0
    } = filters;

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (priority) {
      whereConditions.push('priority = ?');
      queryParams.push(priority);
    }

    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${this.mapSortField(sortBy)} ${sortOrder.toUpperCase()}`;

    const countQuery = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
    const total = await new Promise<number>((resolve, reject) => {
      this.db.get(countQuery, queryParams, (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.total);
        }
      });
    });

    const dataQuery = `
      SELECT * FROM tasks 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `;
    
    const tasks = await new Promise<Task[]>((resolve, reject) => {
      this.db.all(dataQuery, [...queryParams, limit, offset], (err, rows: any[]) => {
        if (err) {
          reject(new Error(`Failed to fetch tasks: ${err.message}`));
        } else {
          const tasks = rows.map(this.mapRowToTask);
          resolve(tasks);
        }
      });
    });

    return {
      success: true,
      data: tasks,
      pagination: {
        total,
        limit,
        offset,
        hasNext: offset + limit < total,
        hasPrev: offset > 0
      }
    };
  }

  async getTaskById(id: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tasks WHERE id = ?';
      
      this.db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(new Error(`Failed to fetch task: ${err.message}`));
        } else if (!row) {
          resolve(null);
        } else {
          resolve(this.mapRowToTask(row));
        }
      });
    });
  }

  async updateTask(id: string, updateData: UpdateTaskRequest): Promise<Task | null> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      return null;
    }

    const updatedTask = {
      ...existingTask,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ?, priority = ?, updated_at = ?, due_date = ?
        WHERE id = ?
      `;
      
      this.db.run(
        query,
        [updatedTask.title, updatedTask.description, updatedTask.status, updatedTask.priority, updatedTask.updatedAt, updatedTask.dueDate, id],
        function(err) {
          if (err) {
            reject(new Error(`Failed to update task: ${err.message}`));
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            resolve(updatedTask);
          }
        }
      );
    });
  }

  async deleteTask(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ?';
      
      this.db.run(query, [id], function(err) {
        if (err) {
          reject(new Error(`Failed to delete task: ${err.message}`));
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      dueDate: row.due_date
    };
  }

  private mapSortField(sortBy: string): string {
    const fieldMap: Record<string, string> = {
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'dueDate': 'due_date',
      'priority': 'priority'
    };
    return fieldMap[sortBy] || 'created_at';
  }
}