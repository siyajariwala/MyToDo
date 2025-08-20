
// frontend/src/config.js

// API Base URL - changes based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://mytodo-backend-v2.onrender.com'  // Replace with your actual Render URL
  : 'http://localhost:5001';

export default API_BASE_URL;