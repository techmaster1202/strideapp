import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8000/api/', // Replace with your Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

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
