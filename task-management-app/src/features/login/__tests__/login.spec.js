import '@testing-library/jest-dom';
import React from 'react';
import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from '../login';
import loginService from '../../../services/loginService';
import {describe, it, expect} from "@jest/globals";


jest.mock('../../../services/loginService');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('renders login form', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('calls loginService on form submit', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        loginService.login.mockResolvedValue({ success: true }); // Mock successful login

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password' } });
            fireEvent.click(submitButton);
        })

        expect(loginService.login).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('displays error message on failed login', async () => {
        loginService.login.mockResolvedValue({ success: false, error: "Invalid credentials" }); // Mock failed login

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
            fireEvent.click(submitButton);
        })
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});