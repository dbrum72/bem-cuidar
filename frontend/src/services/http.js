import axios from 'axios';
import store from '@/store';

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

axiosInstance.interceptors.request.use(config => {
  const token = store.state.auth.token;
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
