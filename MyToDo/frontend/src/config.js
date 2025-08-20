const API_BASE_URL = import.meta.env.PROD 
  ? 'https://mytodo-backend-v2.onrender.com'
  : 'http://localhost:5001';

export default API_BASE_URL;