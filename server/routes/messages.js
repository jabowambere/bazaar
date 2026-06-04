const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET last 50 messages
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('userId', 'name');
    res.status(200).json(messages.reverse());
  } catch {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

module.exports = router;
