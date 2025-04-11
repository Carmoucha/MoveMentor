const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  fitnessGoals: {
    type: [String],
    required: true
  },
  workoutPreferences: {
    type: [String],
    required: true
  },
  experienceLevel: {
    type: String,
    required: true
  },
  limitations: {
    type: [String],
    required: true
  },
  otherLimitations: {
    type: String,
    default: ''
  }
}, { _id: false });


const workoutProgressSchema = new mongoose.Schema({
  counts: {
    type: Object,
    default: {}
  },  
  totalCompleted: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastWorkoutDate: { type: String, default: null },     // e.g. "2025-04-10"
  dailyStats: { type: Object, default: {} }    
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  onboarding: onboardingSchema,
  workoutProgress: workoutProgressSchema,
  badges: {
    type: [String],
    default: []
  }
});


module.exports = mongoose.model('User', userSchema);
