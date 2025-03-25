# MoveMentor – Student Fitness Tracker App

**MoveMentor** is a cross-platform mobile fitness app built with **React Native (Expo)**, designed to help university students maintain an active lifestyle. It features personalized workout recommendations, habit tracking, streaks, and progress feedback – all wrapped in a clean and simple user interface.

---

## Getting Started

### 🛠 Prerequisites
- Node.js and npm installed
- Expo CLI installed globally:
  ```bash
  npm install -g expo-cli
  ```
- A device/emulator with Expo Go (iOS/Android)

---

## 📦 Installation & Setup

### 1. Clone the Repo
```bash
git clone https://github.com/Carmoucha/MoveMentor
cd movementor
```

### 2. Install Frontend Dependencies
```bash
cd MoveMentor
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

---

## ▶️ Running the App

### Start the Backend API
```bash
cd backend
node server.js
```

### Start the Frontend (Expo)
```bash
cd MoveMentor
npx expo start
```
- Scan the QR code with Expo Go OR
- Press `i` for iOS / `a` for Android emulator

---

## 📂 Folder Structure (folders and files that have been added)

```
movementor/
│
├── MoveMentor/                   # Frontend folder (Expo App)
│   ├── app/                      # Screens + navigation
│   │   ├── (tabs)/               # Bottom tab navigation
│   │   │   ├── progress.tsx      # Progress tracking
│   │   │   └── workout.tsx       # Workout Screen
|   |   |   └── index.tsx         # homeScreen
│   │   ├── login.tsx             # Login screen
│   │   ├── onboarding.tsx        # Onboarding questionnaire
│   │   ├── dashboard.tsx         # Main dashboard view
│   │
│   ├── components/
│   │   └── ui/                   # Reusable components
│   │       ├── WorkoutCard.tsx   # Card UI for a workout
│   │       ├── ProgressBar.tsx   # Progress indicator 
│   │       ├── StreakBadge.tsx   # Badge for streaks
│   │       ├── Header.tsx        # Reusable header or nav
│   │    
│   │
│   ├── assets/                   # Fonts, icons, images
│   ├── constants/                # Color, size, etc.
│   ├── hooks/                    # Custom hooks
|   |   ├── useUserPreferences.ts #  Store/retrieve onboarding data   


├── backend/                    # Minimal backend API
│   ├── server.js               # Express app entry
│   ├── routes/
│   │   ├── workouts.js         # `GET /workouts`
│   │   └── users.js            # `POST /preferences`
│   ├── data/
│   │   └── workouts.json       # Static workouts

```

---

## 🧪 API Endpoints (Backend)

- `GET /workouts`  
Returns a list of workouts based on preferences

- `POST /preferences`  
Receives onboarding data (goal, level, type)

Mock data is stored in `backend/data/workouts.json`

---

## 💡 App Features

- Login & onboarding flow
- Personalized workouts based on fitness goal, level, gym/home
- Visual feedback: streaks, goals, progress bar
- Gamification: badges and engagement rewards
- Simple and fast UI/UX
