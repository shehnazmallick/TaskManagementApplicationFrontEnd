import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {describe, it, expect, beforeEach} from '@jest/globals';
import Cookies from 'js-cookie';
import HomePage from "../home.jsx";
import configureStore from "redux-mock-store";
import {Provider} from "react-redux";


const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'), // Make sure to import the actual module first
        useNavigate: () => mockNavigate,
    };
});

jest.mock('js-cookie', () => ({
    remove: jest.fn(),
}));

// Mock the taskService
jest.mock('../../../services/taskService'); // Important: Mock the module


describe('HomePage Component', () => {
    let store;

    beforeEach(() => {
        // Create a mock store
        store = configureStore()({
            userSettings: { showNotifications: true }
        });
        // Reset mock before each test
        mockNavigate.mockClear();
    });

    it('renders navigation links', () => {
        render(
            <Provider store={store}>
                <HomePage />
            </Provider>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Tasks')).toBeInTheDocument();
        expect(screen.getByText('Task Manager')).toBeInTheDocument();
        expect(screen.getByTestId('notification-icon')).toBeInTheDocument();
    });

    it('renders user dropdown', async () => {
        render(
            <Provider store={store}>
                <HomePage />
            </Provider>
        );

        const dropdownToggle = screen.getByTestId('user-dropdown');
        // Click the toggle button
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })

        // Check if the PersonCircle icon is rendered within the toggle
        const personCircleIcon = screen.getByTestId('person-circle');
        expect(personCircleIcon).toBeInTheDocument();

        // Simulate a click on the dropdown toggle to open it
        fireEvent.click(dropdownToggle);

        // Check if the dropdown menu items are rendered
        expect(screen.getByText('User Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('handles logout when clicked on logout option in user dropdown', async() => {
        render(
            <Provider store={store}>
                <HomePage />
            </Provider>
        );

        // Simulate a click on the dropdown toggle to open it
        const dropdownToggle = screen.getByTestId('user-dropdown');
        // Click the toggle button
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })

        // Simulate clicking the "Logout" button
        const logoutButton = screen.getByText('Logout');
        await act(async () => {
            fireEvent.click(logoutButton);
        });

        // Assertions
        expect(Cookies.remove).toHaveBeenCalledWith('token', { path: '/' });
        expect(Cookies.remove).toHaveBeenCalledWith('userId', { path: '/' });
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

});