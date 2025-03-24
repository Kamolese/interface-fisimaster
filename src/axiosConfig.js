import axios from 'axios';

// Garantir que a URL da API está definida corretamente
const apiUrl = import.meta.env.VITE_API_URL || 'https://api-fisimaster.onrender.com';
console.log('Configurando axios com URL:', apiUrl);
axios.defaults.baseURL = apiUrl;

// Desabilitar withCredentials para evitar problemas de CORS
axios.defaults.withCredentials = false;

// Aumentar o timeout para lidar com possíveis latências no servidor
axios.defaults.timeout = 30000;

// Adicionar interceptors para debug
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