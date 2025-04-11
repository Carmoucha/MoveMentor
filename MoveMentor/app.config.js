// app.config.js
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './backend/.env') }); // Load environment variables from .env file

export default {
  expo: {
    name: 'MoveMentor',
    slug: 'MoveMentor',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    extra: {
      apiKey: process.env.GOOGLE_API_KEY,  // This will pull the API key from the .env file
    },
  },
};
