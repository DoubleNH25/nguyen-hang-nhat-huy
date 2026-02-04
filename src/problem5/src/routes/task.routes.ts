import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

router.post('/', taskController.createTask);

router.get('/', taskController.getAllTasks);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

export default router;