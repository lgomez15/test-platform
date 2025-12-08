import axios from 'axios';

// Use relative URL so it works with Vite proxy (dev) and Nginx proxy (prod)
const instance = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to attach the token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
