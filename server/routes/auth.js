import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, displayName } = req.body;
    if (!username?.trim() || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }

    const exists = await User.findOne({ username: username.trim().toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Username already taken' });

    const user = await User.create({
      username: username.trim().toLowerCase(),
      password,
      displayName: displayName?.trim() || username.trim(),
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, displayName: user.displayName },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, displayName: user.displayName },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user._id, username: user.username, displayName: user.displayName } });
});

export default router;
