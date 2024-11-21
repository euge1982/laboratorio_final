//Archivo axios.js

import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token a todas las solicitudes
api.interceptors.request.use(config => {
    const token = Cookies.get('token');
    console.log('token', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('config', config);
    }
    return config;
  });

  // Interceptor para manejar la sesion expirada
  api.interceptors.response.use(
    response => response, 
    error => {
      if (error.response.status === 401) {
        Cookies.remove('token');
        window.location.href = '/session-expired';
      } 
      return Promise.reject(error);
    }
  );

export default api;
