import axios from 'axios';

// ✅ Correct way to access Vite env variables
const API_URL = import.meta.env.VITE_API_URL;

// Configure axios
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Export
export { API_URL };
export default instance;
