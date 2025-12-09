import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { documents } from '../data.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  }
});

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

// Upload document
router.post('/upload', upload.single('file'), (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type, name } = req.body;
    const newDocument = {
      id: String(documents.length + 1),
      name: name || req.file.originalname,
      type: type || 'other',
      uploadedBy: req.user?.name || 'Unknown',
      uploadedAt: new Date().toISOString().split('T')[0],
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };

    documents.push(newDocument);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Download document
router.get('/:id/download', (req, res) => {
  const document = documents.find(d => d.id === req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const filePath = path.join(process.cwd(), document.url);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, document.name);
});

router.delete('/:id', (req, res) => {
  const index = documents.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const document = documents[index];
  
  // Delete file from filesystem
  if (document.filename) {
    const filePath = path.join(process.cwd(), document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  documents.splice(index, 1);
  res.json({ message: 'Document deleted' });
});

export default router;
