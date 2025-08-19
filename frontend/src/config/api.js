import axios from 'axios';

// Centralized API configuration
const API_URL = process.env.REACT_APP_API_URL; // /http://localhost:5000';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Export for use in components
export { API_URL };
export default axios;
