import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {STORAGE_KEY} from './constantKey';

export const baseIP = '192.168.0.101';

const axiosInstance = axios.create({
  baseURL: `http://${baseIP}:8000/api/`, // Replace with your Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const user = JSON.parse(data);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
// Add a request interceptor to attach tokens or other headers
// axiosInstance.interceptors.request.use(
//   config => {
//     // Example: Add an Authorization header if a token is available
//     const token = 'your_token'; // Replace with your token logic, e.g., from AsyncStorage
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     console.log('config ===> ', config);
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// Add a response interceptor to handle responses or errors globally
// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     // Handle specific error codes (e.g., 401 for unauthorized)
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized access (e.g., redirect to login)
//       console.log('Unauthorized, logging out...');
//     }
//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
