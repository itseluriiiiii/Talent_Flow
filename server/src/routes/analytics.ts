import { Router } from 'express';
import { analyticsData } from '../data.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json(analyticsData);
});

export default router;
