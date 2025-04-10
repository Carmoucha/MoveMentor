const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  fitnessGoals: [String], // e.g. ["Build Muscles", "Improve Cardio"]
  workoutPreferences: { type: String }, // e.g. "Home Workouts", "Gym", or "Both"
  experienceLevel: { type: String }, // "Beginner", "Intermediate", or "Advanced"
  limitations: [String], // e.g. ["Limited Space", "Quiet Workouts"]
  otherLimitations: { type: String } // text from "Other" field (optional)
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
