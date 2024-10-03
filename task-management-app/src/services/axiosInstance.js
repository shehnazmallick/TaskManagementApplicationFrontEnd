import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Axios Instance to be used to hit for all other urls for JWT token validation other than login and signup
 * @type {axios.AxiosInstance}
 */

const instance = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend URL
    withCredentials: true, // If using cookies for authentication
});

// Add a request interceptor to include the access token in requests
instance.interceptors.request.use(
    (config) => {
        const userId = Cookies.get('userId');
        if (userId) {
             config.params = config.params || {}; // Ensure params object exists
            config.params.userId = userId;
        }

        const token = Cookies.get('token'); // Assuming you store the access token in a cookie named 'token'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
instance.interceptors.response.use(
    (response) => {
        return response; // Pass successful responses through
    },
    async (error) => {
        const originalRequest = error.config;
        // Check if the error is due to a 401 (Unauthorized) status
        // and if the request has not already been retried
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            try {
                const refreshToken = Cookies.get('token'); // Get the refresh token from cookies

                // If refresh token is not available, redirect to login
                if (!refreshToken) {
                    // Handle the case where the refresh token is missing
                    // You might want to redirect the user to the login page here
                    console.error('Refresh token not found. Redirecting to login...');
                    window.location.href = '/auth/login'; // Replace '/login' with your actual login route
                    return Promise.reject(error); // Reject the original request
                }

                // Make a request to refresh the access token
                const refreshResponse = await axios.post('/api/auth/refreshtoken', { // Adjust the endpoint if needed
                    refreshToken: refreshToken,
                });

                // Store the new access token
                const newAccessToken = refreshResponse.data; // Assuming the response contains the new access token
                Cookies.set('token', newAccessToken); // Store the new access token in a cookie
                // Retry the original request with the new access token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token errors (e.g., refresh token is invalid or expired)
                console.error('Refresh token error:', refreshError);

                // Redirect to login or handle as needed
                window.location.href = '/auth/login';
                // ...

                return Promise.reject(refreshError); // Reject the original request
            }
        }

        return Promise.reject(error); // Reject other errors
    }
);

export default instance;