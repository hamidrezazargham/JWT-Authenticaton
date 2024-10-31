import axios from 'axios';

// Create Axios instance with default authorization header
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// Interceptor to automatically refresh token if access token is expired
axiosInstance.interceptors.response.use(
    (response) => response, // Pass any response if no error
    async (error) => {
        const originalRequest = error.config;
        
        // If token is expired, try to refresh it
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
                
                // Update tokens in localStorage
                localStorage.setItem('token', response.data.access);
                
                // Update Authorization header and retry the original request
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.reload(); // Force logout
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
