import axios from 'axios';
import store from '@/store';

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

axiosInstance.interceptors.request.use(config => {
  const token = store.state.auth.token;
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.commit('auth/logout');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
