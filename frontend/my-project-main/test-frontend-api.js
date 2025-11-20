// Simple test to verify frontend can communicate with backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

console.log('Testing API connection...');
console.log('API Base URL:', `${API_BASE_URL}/api`);

// Test login endpoint
fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});