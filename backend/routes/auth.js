const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
