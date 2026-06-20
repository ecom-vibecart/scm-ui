import axios from 'axios';

export const VIBECART_URI = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5001`;

// Attach JWT to every outgoing request automatically
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});