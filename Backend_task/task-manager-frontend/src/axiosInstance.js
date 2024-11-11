
import axios from 'axios';

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', 
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('authToken'), 
    },
    withCredentials: true, 
});

// Add an interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response, // Pass through if the response is successful
    (error) => {
        if (error.response && error.response.status === 401) {
            // Assuming 401 means token is expired or unauthorized
            localStorage.removeItem('token'); // Clear the token from local storage
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
