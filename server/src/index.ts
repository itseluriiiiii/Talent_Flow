import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import candidatesRoutes from './routes/candidates.js';
import interviewsRoutes from './routes/interviews.js';
import employeesRoutes from './routes/employees.js';
import analyticsRoutes from './routes/analytics.js';
import documentsRoutes from './routes/documents.js';
import onboardingRoutes from './routes/onboarding.js';
import offboardingRoutes from './routes/offboarding.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/offboarding', offboardingRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'TalentFlow API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      candidates: '/api/candidates',
      interviews: '/api/interviews',
      employees: '/api/employees',
      onboarding: '/api/onboarding',
      offboarding: '/api/offboarding',
      documents: '/api/documents',
      analytics: '/api/analytics',
      dashboard: '/api/dashboard',
    },
    documentation: 'See server/README.md for full API documentation',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TalentFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
});
