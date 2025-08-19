import axios from 'axios';

// Centralized API configuration
const API_URL = import.meta.env.VITE_API_URL;  // Vite env variables

// Configure axios defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // optional, agar cookies/session use karte ho
});

export { API_URL };
export default api;
