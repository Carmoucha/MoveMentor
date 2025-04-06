require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const usersRoute = require('./routes/users');

app.use(express.json());
app.use('/users', usersRoute);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(8000, () => {
      console.log('Server running on http://localhost:8000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
