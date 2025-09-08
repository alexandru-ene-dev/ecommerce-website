import axios from 'axios';

console.log('AXIOS BASE URL:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export default api;