// src/services/http.js
import axios from 'axios';
import store from '@/store';
import router from '@/router'; // adicione esta importação

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// Adiciona o token no cabeçalho de todas as requisições
axiosInstance.interceptors.request.use(config => {
    const token = store.state.auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Intercepta respostas para tratar expiração ou falta de autorização
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.dispatch('auth/logout');
            router.push({ name: 'Login' }); // redireciona automaticamente
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
