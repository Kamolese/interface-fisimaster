import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'https://api-fisimaster.onrender.com';
console.log('Configurando axios com URL:', apiUrl);
axios.defaults.baseURL = apiUrl + '/api';

axios.defaults.withCredentials = false;

axios.defaults.timeout = 30000;

axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.error('Response Error:', error);
  return Promise.reject(error);
});