import axios from 'axios';

export const apiService = axios.create({
  baseURL: `http://localhost:8888/api/v1`,
  timeout: 1200000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
});

apiService.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          console.log('No refresh token available in localStorage.');
          throw new Error('Refresh token is missing.');
        }

        const { data } = await apiService.post('/identity/auth/refresh', {
          refreshToken,
        });

        console.log('Token refreshed:', data.result.token);

        localStorage.setItem('accessToken', data.result.token);
        localStorage.setItem('expiryTime', data.result.expiryTime);

        originalRequest.headers.Authorization = `Bearer ${data.result.token}`;
        return apiService(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiryTime');
        localStorage.removeItem('roles');

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
