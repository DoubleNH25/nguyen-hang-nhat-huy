import Joi from 'joi';
import { TaskStatus, TaskPriority } from '../types/task.types';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 1 character long',
    'string.max': 'Title cannot exceed 200 characters'
  }),
  description: Joi.string().min(1).max(1000).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 1 character long',
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional(),
  dueDate: Joi.string().isoDate().optional().messages({
    'string.isoDate': 'Due date must be a valid ISO date string'
  })
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    'string.min': 'Title must be at least 1 character long',
    'string.max': 'Title cannot exceed 200 characters'
  }),
  description: Joi.string().min(1).max(1000).optional().messages({
    'string.min': 'Description must be at least 1 character long',
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  status: Joi.string().valid(...Object.values(TaskStatus)).optional(),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional(),
  dueDate: Joi.string().isoDate().optional().messages({
    'string.isoDate': 'Due date must be a valid ISO date string'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const taskFiltersSchema = Joi.object({
  status: Joi.string().valid(...Object.values(TaskStatus)).optional(),
  priority: Joi.string().valid(...Object.values(TaskPriority)).optional(),
  search: Joi.string().max(100).optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'dueDate', 'priority').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  offset: Joi.number().integer().min(0).optional()
});