#!/usr/bin/env node
// Simple script to verify the configuration

console.log('=== College Connect Configuration Check ===\n');

console.log('Frontend Configuration:');
console.log('- Environment variable: VITE_API_URL');
console.log('- Local API URL: http://localhost:5000');
console.log('- Production API URL: https://college-connect-iufs.onrender.com\n');

console.log('Backend Configuration:');
console.log('- CORS origins configured for:');
console.log('  - http://localhost:5173');
console.log('  - https://college-connect-website.onrender.com\n');

console.log('=== Testing Instructions ===');
console.log('1. For local development:');
console.log('   - Backend: npm start (runs on http://localhost:5000)');
console.log('   - Frontend: npm run dev (runs on http://localhost:5173)');
console.log('   - Test API: http://localhost:5000/api/health');
console.log('\n2. For production:');
console.log('   - Backend: https://college-connect-iufs.onrender.com/api/health');
console.log('   - Frontend: https://college-connect-website.onrender.com');
console.log('\n3. Environment variables should be set in:');
console.log('   - Frontend .env file: VITE_API_URL');
console.log('   - Backend .env file: MONGO_URI, PORT, FRONTEND_URL, JWT_SECRET');
