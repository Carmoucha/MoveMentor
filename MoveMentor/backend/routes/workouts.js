const express = require('express');
const router = express.Router();
const User = require('../models/User');
const workoutCategoryMap = require('../utils/workoutMap');
const dayjs = require('dayjs');
const badgeDefinitions = require('../utils/badges');


// Increment workout
router.post('/increment', async (req, res) => {
  const { userId, type } = req.body;
  const category = workoutCategoryMap[type];
  const today = dayjs().format('YYYY-MM-DD');

  if (!category) return res.status(400).json({ message: 'Invalid workout type' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.workoutProgress) {
      user.workoutProgress = {
        counts: {},
        totalCompleted: 0,
        streakCount: 0,
        lastWorkoutDate: null,
        dailyStats: {}
      };
    }

    const wp = user.workoutProgress;

    // All-time counts
    const counts = { ...(wp.counts || {}) };
    counts[category] = (counts[category] || 0) + 1;
    wp.counts = counts;

    wp.totalCompleted += 1;

    // Clone today’s stats (safe shallow clone)
    const allStats = { ...(wp.dailyStats || {}) };
    const todayStats = { ...(allStats[today] || {}) };

    // Update the category
    todayStats[category] = (todayStats[category] || 0) + 1;
    todayStats.total = (todayStats.total || 0) + 1;

    // Save it back
    allStats[today] = todayStats;
    wp.dailyStats = allStats;


      // Streak logic
      const lastDate = wp.lastWorkoutDate;
      if (!lastDate) {
        wp.streakCount = 1;
      } else {
        const diff = dayjs(today).diff(dayjs(lastDate), 'day');
        if (diff === 1) {
          wp.streakCount += 1; // continued streak
        } else if (diff > 1) {
          wp.streakCount = 1;  // missed a day → reset streak
        } // if same day → don't touch streak
      }

      if (lastDate !== today) {
        wp.lastWorkoutDate = today;
      }

      await user.save();
      const unlocked = user.badges || [];

      for (const badge of badgeDefinitions) {
        if (!unlocked.includes(badge.id) && badge.condition(user.workoutProgress)) {
          unlocked.push(badge.id);
          console.log(`🏅 Unlocked badge: ${badge.title}`);
        }
      }

      user.badges = unlocked;
      await user.save();

      res.status(200).json({
        message: 'Workout incremented',
        progress: wp,
        badges: unlocked });

  } catch (err) {
    console.error('Increment Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/decrement', async (req, res) => {
  const { userId, type } = req.body;
  const category = workoutCategoryMap[type];
  const today = dayjs().format('YYYY-MM-DD');

  if (!category) return res.status(400).json({ message: 'Invalid workout type' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const wp = user.workoutProgress;
    if (!wp || !wp.counts) {
      return res.status(400).json({ message: 'No progress to decrement' });
    }

    // All-time counts
    const counts = { ...(wp.counts || {}) };
    const current = counts[category] || 0;

    if (current > 0) {
      counts[category] = current - 1;
      wp.totalCompleted -= 1;
    } else {
      return res.status(400).json({ message: 'Workout count already zero' });
    }

    wp.counts = counts;

    // Daily stats
    const allStats = { ...(wp.dailyStats || {}) };
    const todayStats = { ...(allStats[today] || {}) };

    if (todayStats[category]) {
      todayStats[category] -= 1;
      todayStats.total -= 1;

      if (todayStats[category] === 0) delete todayStats[category];

      // Remove day if total = 0
      if (todayStats.total <= 0) {
        delete allStats[today];

        // Streak fix if this was today's only workout
        if (wp.lastWorkoutDate === today) {
          wp.streakCount = Math.max(0, wp.streakCount - 1);
          wp.lastWorkoutDate = null;
        }
      } else {
        allStats[today] = todayStats;
      }

      wp.dailyStats = allStats;
    }

    await user.save();

    res.status(200).json({
      message: 'Workout decremented',
      progress: wp
    });

  } catch (err) {
    console.error('Decrement Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// helper to group counts by goal
const goalCategoryMap = {
  'Build Muscles': ['upper_body', 'lower_body', 'strength_training'],
  'Improve Cardio': ['cardio'],
  'Improve Flexibility': ['mobility', 'flexibility'],
  'Lose Weight': ['cardio', 'strength_training', 'core']
};

const getGroupedProgress = (counts, goals) => {
  const grouped = {};
  const seen = new Set();

  for (const goal of goals) {
    const categories = goalCategoryMap[goal] || [];
    grouped[goal] = 0;

    for (const cat of categories) {
      grouped[goal] += counts?.[cat] || 0;
      seen.add(cat);
    }
  }

  let other = 0;
  for (const cat in counts) {
    if (!seen.has(cat)) other += counts[cat];
  }

  grouped["Other"] = other;
  return grouped;
};

// Get progress
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('workoutProgress onboarding');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const goals = user.onboarding?.fitnessGoals || [];
    const counts = user.workoutProgress?.counts || {};

    const groupedCounts = getGroupedProgress(counts, goals);

    res.status(200).json({
      goals,
      rawCounts: counts,
      groupedCounts,
      totalCompleted: user.workoutProgress?.totalCompleted || 0,
      streakCount: user.workoutProgress?.streakCount || 0,
      dailyStats: user.workoutProgress?.dailyStats || {}
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Reset (used it for testing backend)
router.post('/reset', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.workoutProgress = { counts: {}, totalCompleted: 0, streakCount: 0 };
    await user.save();

    res.status(200).json({ message: 'Progress reset' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all badge statuses
router.get('/badges/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('workoutProgress badges');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const earned = user.badges || [];

    const allBadges = badgeDefinitions.map((b) => ({
      id: b.id,
      title: b.title,
      earned: earned.includes(b.id)
    }));

    res.json({ badges: allBadges });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
