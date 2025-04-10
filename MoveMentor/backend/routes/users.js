const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;
const User = require('../models/User'); // use real model

// REGISTER 
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// LOGIN 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
  
});
// Save onboarding answers
router.post('/onboarding', async (req, res) => {
  const { userId, onboarding } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.onboarding = onboarding;
    await user.save();

    res.status(200).json({ message: 'Onboarding saved successfully' });
  } catch (err) {
    console.error('Error saving onboarding:', err);
    res.status(500).json({ message: 'Failed to save onboarding data' });
  }
});

// Get onboarding answers for a user
router.get('/onboarding/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('onboarding');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ onboarding: user.onboarding });
  } catch (err) {
    console.error('Error fetching onboarding data:', err);
    res.status(500).json({ message: 'Failed to fetch onboarding data' });
  }
});

module.exports = router;
