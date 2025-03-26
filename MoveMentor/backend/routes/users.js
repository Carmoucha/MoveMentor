const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;
const User = require('../models/User'); // use real model

// REGISTER (MongoDB version)
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

// LOGIN (MongoDB version)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
