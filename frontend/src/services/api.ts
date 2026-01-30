import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Use adminToken for admin routes, regular token for user routes
        const isAdminRoute = config.url?.startsWith('/admin');
        const token = isAdminRoute
            ? localStorage.getItem('adminToken')
            : localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');

            // Redirect to appropriate login page based on current route
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                // Don't redirect if already on admin login
                if (currentPath !== '/admin/login') {
                    window.location.href = '/admin/login';
                }
            } else {
                // Don't redirect if already on user login
                if (currentPath !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
