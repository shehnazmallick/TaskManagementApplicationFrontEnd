import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import axiosInstance from "../axiosInstance.js";
import { describe, it, expect, afterEach } from '@jest/globals';


// Set up the mock adapter
const mock = new MockAdapter(axiosInstance);

describe('Axios Instance', () => {
    afterEach(() => {
        mock.reset(); // Reset the mock after each test
        window.location = { href: '' };
        Cookies.remove('token');
    });

    it('should fetch tasks', async () => {
        // Mock the response for the /api/tasks endpoint
        mock.onGet('/api/tasks').reply(200, [{ id: 1, title: 'Test Task' }]);

        // Make the request
        const response = await axiosInstance.get('/api/tasks'); // Make sure the URL here matches the mocked route

        // Assertions
        expect(response.status).toBe(200);
        expect(response.data).toEqual([{ id: 1, title: 'Test Task' }]);
    });

    it('should attach userId and token to requests', async () => {
        // Set up cookies
        Cookies.set('userId', '12345');
        Cookies.set('token', 'token123');

        // Mock a request to a sample endpoint
        mock.onGet('/api/test').reply(200, { success: true });

        const response = await axiosInstance.get('/api/test');

        expect(response.data.success).toBe(true);
        expect(mock.history.get[0].params.userId).toBe('12345');
        expect(mock.history.get[0].headers.Authorization).toBe('Bearer token123');
    });


    it('should redirect to login on refresh token error', async () => {
        // Initial request should fail with a 401
        mock.onGet('/api/test').reply(401);

        // Mock a refresh token request to fail
        mock.onPost('/api/auth/refreshtoken').reply(400);

        // Mock window.location.href
        delete window.location; // delete location to redefine it
        window.location = { href: '' };

        const error = await axiosInstance.get('/api/test').catch(err => err);

        expect(window.location.href).toBe('/auth/login');
        expect(error.response.status).toBe(401);
    });

    it('should redirect to login if refresh token is missing', async () => {
        // Initial request should fail with a 401
        mock.onGet('/api/test').reply(401);

        // Mock window.location.href
        delete window.location; // delete location to redefine it
        window.location = { href: '' };

        const error = await axiosInstance.get('/api/test').catch(err => err);

        expect(window.location.href).toBe('/auth/login');
        expect(error.response.status).toBe(401);
    });
});
