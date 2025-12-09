import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, password, name, and role are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: String(Math.max(...users.map(u => parseInt(u.id) || 0), 0) + 1),
      email,
      password: hashedPassword,
      name,
      role: role as 'hr' | 'manager' | 'employee',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&gender=${role === 'hr' ? 'female' : 'male'}`,
      department: role === 'hr' ? 'Human Resources' : 'Engineering',
    };

    users.push(newUser as any);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = newUser;

    console.log(`New user signed up: ${email} with role: ${role}`);
    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log(`Login attempt with wrong password for: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    
    console.log(`User logged in: ${email}`);
    res.json({ 
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
