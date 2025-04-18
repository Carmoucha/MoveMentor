require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*', // or specify IPs if you want to restrict
  credentials: true
}));

const usersRoute = require('./routes/users');
const workoutsRoute = require('./routes/workouts');


app.use(express.json());
app.use('/users', usersRoute); // register/login/onboarding
app.use('/workouts', workoutsRoute); // increment, decrement, progress

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(8000, '0.0.0.0', () => {
      console.log('Server running on http://0.0.0.0:8000');
    });
    
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
