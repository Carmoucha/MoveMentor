# MoveMentor – Student Fitness Tracker App

**MoveMentor** is a cross-platform mobile fitness app built with **React Native (Expo)** and backed by a **Node.js + Express + MongoDB** server. It features personalized workout recommendations, habit tracking, streaks, and progress feedback.  It is designed to help university students maintain an active lifestyle by providing– all wrapped in a clean and simple user interface.

---

## Getting Started

### 🛠 Prerequisites
- Node.js and npm installed
- Expo CLI installed globally:
  ```bash
  npm install -g expo-cli
  ```
- A device/emulator with Expo Go (iOS/Android)
- API keys (ask a team member)


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
### 4. In the file MoveMentor/constants/IP.js replace the current IP with:

- Your **local machine’s IP address** if you're using a real device (e.g., Expo Go).
- Use `localhost` or `127.0.0.1` if you're testing in an emulator/simulator.



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

## 💡 App Features

- Login & onboarding flow
- Personalized workouts based on fitness goal, level, gym/home
- Visual feedback: streaks, goals, progress bar
- Gamification: badges and engagement rewards
- Simple and fast UI/UX

---

## Demo video
https://drive.google.com/file/d/1Jx4g2PnuoFyPEwjqbsafYjBlDepMx8c6/view?usp=sharing
