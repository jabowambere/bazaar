const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: 'Fetching users failed' });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Update failed' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot delete your own account' });
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Deleting user failed' });
  }
});

module.exports = router;
