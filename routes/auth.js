const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
});

router.get('/me', protect, (req, res) => {
  res.status(200).json({ user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

module.exports = router;
