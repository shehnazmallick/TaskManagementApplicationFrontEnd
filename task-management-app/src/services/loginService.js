import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api/auth'; // Replace with your actual backend API URL

const loginService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                username, // Make sure these keys match your backend API expectations
                password,
            })

            if (response.status === 200) {
                // Successful login
                const token = response.data.token; // Assuming your backend sends back a JWT token
                //localStorage.setItem('token', token); // Store the token in local storage
                // Store JWT in an HttpOnly cookie
                Cookies.set('token', token, {
                    expires: 1/60, // Expires in 1 hour (adjust as needed)
                    path: '/',   // Make it accessible across your entire domain
                    secure: false, // Set to true if using HTTPS
                    httpOnly: false, // Crucial for security - prevents JS access
                });
                localStorage.setItem('username', response.data.userName);
                const userSettings = JSON.stringify(response.data.userSettings)
                localStorage.setItem('userSettings', userSettings);
                return { success: true, token };
            } else {
                // Handle other status codes (e.g., 401 Unauthorized)
                return { success: false, error: response.data.message || 'Login failed' };
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Login error:', error);
            return { success: false, error: 'An error occurred during login.' };
        }
    },

    signUp: async (username, password, firstName, lastName) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                username,
                password,
                firstName,
                lastName,
            });
            if (response.status === 201) {
                // Successful signup
                return { success: true };
            }
            return { success: false, error: response.data.message || 'Signup failed' };
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Login error:', error);
            return { success: false, error: 'An error occurred during login.' };
        }
    },
};

export default loginService;