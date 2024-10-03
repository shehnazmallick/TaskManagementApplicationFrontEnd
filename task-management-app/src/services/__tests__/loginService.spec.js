import axios from "axios";
import Cookies from 'js-cookie';
import loginService from '../loginService'; // Adjust the path if needed
import {describe, it, expect, afterEach} from "@jest/globals";
//import axiosInstance from "../axiosInstance.js";

jest.mock('js-cookie');
//jest.mock('../axiosInstance.js')
jest.mock('axios');

describe('loginService', () => {
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear(); // Clear local storage after each test
        Cookies.remove('token'); // Clear cookies after each test
    });

    it('should successfully log in a user', async () => {
        const mockToken = 'test-token';
        const mockUsername = 'testuser';
        const mockUserSettings = { theme: 'light' }; // Example user settings

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                token: mockToken,
                userName: mockUsername,
                userSettings: mockUserSettings,
            },
        });

        const result = await loginService.login('testuser', 'password');

        expect(result).toEqual({ success: true, token: mockToken });
        expect(localStorage.getItem('username')).toBe(mockUsername);
        expect(JSON.parse(localStorage.getItem('userSettings'))).toEqual(mockUserSettings);
    });

    it('should handle login failure', async () => {
        const mockErrorMessage = 'Invalid credentials';
        axios.post.mockResolvedValue({
                status: 401,
                data: { message: mockErrorMessage },
        });

        const result = await loginService.login('testuser', 'wrongpassword');

        expect(result).toEqual({ success: false, error: "Invalid credentials" });
        expect(localStorage.getItem('token')).toBeNull();
    });


    it('should handle network errors during login', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        const result = await loginService.login('testuser', 'password');

        expect(result).toEqual({
            success: false,
            error: 'An error occurred during login.',
        });
        expect(localStorage.getItem('token')).toBeNull(); // Ensure token is not stored
    });

    it('should successfully sign up a user', async () => {
        const mockUsername = 'testuser';
        const mockPassword = 'password';
        const mockFirstName = 'test';
        const mockLastName = 'user';

        axios.post.mockResolvedValue({
            status: 201,
            data: {
                username: mockUsername,
                password: mockPassword,
                firstName: mockFirstName,
                lastName: mockLastName,
            },
        });

        const result = await loginService.signUp('testuser', 'password', 'test', 'user');

        expect(result).toEqual({ success: true });
    });

    it('should handle signup failure', async () => {
        const mockErrorMessage = 'User already exists';
        axios.post.mockResolvedValue({
            status: 400,
            data: { message: mockErrorMessage },
        });

        const result = await loginService.signUp('testuser', 'password', 'test', 'user');

        expect(result).toEqual({ success: false, error: "User already exists" });
    });


    it('should handle network errors during signup', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        const result = await loginService.signUp('testuser', 'password', 'test', 'user');

        expect(result).toEqual({
            success: false,
            error: 'An error occurred during login.',
        });
    });
});