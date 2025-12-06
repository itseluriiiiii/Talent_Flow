import { Router } from 'express';
import { employees } from '../data.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json(employees);
});

router.get('/:id', (req, res) => {
  const employee = employees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(employee);
});

router.post('/', (req, res) => {
  const newEmployee = {
    id: String(employees.length + 1),
    ...req.body,
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

router.put('/:id', (req, res) => {
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  employees[index] = { ...employees[index], ...req.body };
  res.json(employees[index]);
});

router.delete('/:id', (req, res) => {
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  employees.splice(index, 1);
  res.json({ message: 'Employee deleted' });
});

export default router;
