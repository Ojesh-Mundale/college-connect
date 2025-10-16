import axios from "axios";

// Use only the URL from env, no 'VITE_API_URL='
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,  // e.g., https://college-connect-iufs.onrender.com
  withCredentials: true
});

export default api;
