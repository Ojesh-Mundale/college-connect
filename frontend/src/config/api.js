import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ correct

const api = api.create({
  baseURL: API_URL, // ✅ baseURL should be just the value
  withCredentials: true,
});

export default api;
