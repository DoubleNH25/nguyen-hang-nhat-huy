import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { 
  createTaskSchema, 
  updateTaskSchema, 
  taskFiltersSchema 
} from '../validators/task.validator';
import { ApiResponse } from '../types/task.types';

export class TaskController {
  private taskService = new TaskService();

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = createTaskSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0]?.message || 'Validation failed'
        } as ApiResponse<never>);
        return;
      }

      const task = await this.taskService.createTask(value);
      
      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      } as ApiResponse<typeof task>);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse<never>);
    }
  };

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = taskFiltersSchema.validate(req.query);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0]?.message || 'Invalid query parameters'
        } as ApiResponse<never>);
        return;
      }

      const result = await this.taskService.getAllTasks(value);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse<never>);
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Task ID is required'
        } as ApiResponse<never>);
        return;
      }

      const task = await this.taskService.getTaskById(id);
      
      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        } as ApiResponse<never>);
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      } as ApiResponse<typeof task>);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse<never>);
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Task ID is required'
        } as ApiResponse<never>);
        return;
      }

      const { error, value } = updateTaskSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: error.details[0]?.message || 'Validation failed'
        } as ApiResponse<never>);
        return;
      }

      const updatedTask = await this.taskService.updateTask(id, value);
      
      if (!updatedTask) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        } as ApiResponse<never>);
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      } as ApiResponse<typeof updatedTask>);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse<never>);
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Task ID is required'
        } as ApiResponse<never>);
        return;
      }

      const deleted = await this.taskService.deleteTask(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        } as ApiResponse<never>);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      } as ApiResponse<never>);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse<never>);
    }
  };
}