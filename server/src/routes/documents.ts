import { Router } from 'express';
import { documents } from '../data.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json(documents);
});

router.get('/:id', (req, res) => {
  const document = documents.find(d => d.id === req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(document);
});

router.post('/', (req, res) => {
  const newDocument = {
    id: String(documents.length + 1),
    ...req.body,
    uploadedAt: new Date().toISOString().split('T')[0],
  };
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

router.delete('/:id', (req, res) => {
  const index = documents.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  documents.splice(index, 1);
  res.json({ message: 'Document deleted' });
});

export default router;
