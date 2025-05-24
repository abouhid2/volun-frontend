import axios from 'axios';
import { AuthService } from './auth.service';
import { API_CONFIG } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear if the frontend *thought* the user was logged in
      if (AuthService.isAuthenticated()) {
        console.warn('Token invalid — logging out');
        AuthService.logout();
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance; 