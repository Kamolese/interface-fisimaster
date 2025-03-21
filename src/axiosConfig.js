import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://api-fisimaster.onrender.com/api';

axios.defaults.withCredentials = true;

axios.defaults.timeout = 10000;

if (import.meta.env.DEV) {
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
}