import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach token dari localStorage ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('propspace_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-redirect ke login jika 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('propspace_token');
            localStorage.removeItem('propspace_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
