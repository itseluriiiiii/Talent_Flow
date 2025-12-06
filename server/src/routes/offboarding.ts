import { Router } from 'express';
import { offboardingTasks } from '../data.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const { employeeId } = req.query;
  if (employeeId) {
    const tasks = offboardingTasks.filter(t => t.employeeId === employeeId);
    return res.json(tasks);
  }
  res.json(offboardingTasks);
});

router.get('/:id', (req, res) => {
  const task = offboardingTasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.post('/', (req, res) => {
  const newTask = {
    id: String(offboardingTasks.length + 1),
    ...req.body,
  };
  offboardingTasks.push(newTask);
  res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
  const index = offboardingTasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  offboardingTasks[index] = { ...offboardingTasks[index], ...req.body };
  res.json(offboardingTasks[index]);
});

router.delete('/:id', (req, res) => {
  const index = offboardingTasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  offboardingTasks.splice(index, 1);
  res.json({ message: 'Task deleted' });
});

export default router;
