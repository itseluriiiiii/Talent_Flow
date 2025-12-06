import { Router } from 'express';
import { candidates } from '../data.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Validation helper
const validateCandidate = (data: any) => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!data.position || typeof data.position !== 'string' || data.position.trim().length === 0) {
    errors.push('Position is required');
  }

  if (!data.status || !['new', 'screening', 'interview', 'offer', 'hired', 'rejected'].includes(data.status)) {
    errors.push('Valid status is required');
  }

  if (data.phone && typeof data.phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (data.department && typeof data.department !== 'string') {
    errors.push('Department must be a string');
  }

  return errors;
};

router.use(authMiddleware);

// GET /api/candidates - Get all candidates with optional filtering and sorting
router.get('/', (req, res) => {
  try {
    let result = [...candidates];

    // Search filter
    const search = req.query.search as string;
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.position.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    const status = req.query.status as string;
    if (status) {
      result = result.filter((c) => c.status === status);
    }

    // Department filter
    const department = req.query.department as string;
    if (department) {
      result = result.filter((c) => c.department === department);
    }

    // Sorting
    const sortBy = (req.query.sortBy as string) || 'appliedAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    result.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedResult,
      pagination: {
        total: result.length,
        page,
        limit,
        pages: Math.ceil(result.length / limit),
      },
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch candidates' });
  }
});

// GET /api/candidates/:id - Get single candidate
router.get('/:id', (req, res) => {
  try {
    const candidate = candidates.find((c) => c.id === req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch candidate' });
  }
});

// POST /api/candidates - Create new candidate
router.post('/', (req, res) => {
  try {
    // Validate input
    const errors = validateCandidate(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Check for duplicate email
    if (candidates.some((c) => c.email === req.body.email)) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const newCandidate = {
      id: String(Math.max(...candidates.map((c) => parseInt(c.id)), 0) + 1),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      position: req.body.position,
      department: req.body.department || 'General',
      status: req.body.status || 'new',
      aiScore: req.body.aiScore || 0,
      skills: req.body.skills || [],
      experience: req.body.experience || 0,
      resumeUrl: req.body.resumeUrl || '',
      appliedAt: new Date().toISOString().split('T')[0],
      notes: req.body.notes || '',
    };

    candidates.push(newCandidate);
    res.status(201).json({ success: true, data: newCandidate });
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ success: false, error: 'Failed to create candidate' });
  }
});

// PUT /api/candidates/:id - Update candidate
router.put('/:id', (req, res) => {
  try {
    const index = candidates.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    // Validate input if provided
    if (Object.keys(req.body).length > 0) {
      const errors = validateCandidate({ ...candidates[index], ...req.body });
      if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
      }
    }

    // Check for duplicate email (if email is being updated)
    if (req.body.email && req.body.email !== candidates[index].email) {
      if (candidates.some((c) => c.email === req.body.email)) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
    }

    candidates[index] = { ...candidates[index], ...req.body };
    res.json({ success: true, data: candidates[index] });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ success: false, error: 'Failed to update candidate' });
  }
});

// DELETE /api/candidates/:id - Delete candidate
router.delete('/:id', (req, res) => {
  try {
    const index = candidates.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    const deletedCandidate = candidates.splice(index, 1)[0];
    res.json({ success: true, message: 'Candidate deleted', data: deletedCandidate });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete candidate' });
  }
});

export default router;
