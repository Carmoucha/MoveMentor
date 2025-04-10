const badgeDefinitions = [
    { id: 'badge_1', title: 'First Workout!', condition: (wp) => wp.totalCompleted >= 1 },
    { id: 'badge_2', title: '10 Sessions', condition: (wp) => wp.totalCompleted >= 10 },
    { id: 'badge_3', title: 'Streak Starter', condition: (wp) => wp.streakCount >= 3 },
    { id: 'badge_4', title: 'Consistency Boss', condition: (wp) => wp.streakCount >= 7 },
    { id: 'badge_5', title: '50 Total Workouts', condition: (wp) => wp.totalCompleted >= 50 }
  ];
  
  module.exports = badgeDefinitions;