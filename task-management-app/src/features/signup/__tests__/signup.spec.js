import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Signup from '../signup';
import loginService from "../../../services/loginService.js";
import { describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../../services/loginService');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Signup Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders signup form', () => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );

        expect(screen.getByTestId('signup-header')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('calls signupService on form submit', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        loginService.signUp.mockResolvedValue({ success: true }); // Mock successful signup

        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );

        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'testuser' } });
            fireEvent.change(lastNameInput, { target: { value: 'lastname' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Qwert!12' } });
            fireEvent.click(submitButton);
        });

        expect(loginService.signUp).toHaveBeenCalledWith( 'test@example.com', 'Qwert!12', 'testuser', 'lastname');
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });


    it('Incorrect password', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        loginService.signUp.mockResolvedValue({ success: true }); // Mock successful signup

        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );

        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'testuser' } });
            fireEvent.change(lastNameInput, { target: { value: 'lastname' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Password must be 8 characters long and contain at least one uppercase letter, one digit, and one special character.')).toBeInTheDocument(); // Wait for error message to appear
        });
    });

    it('displays error message on failed signup', async () => {
        loginService.signUp.mockResolvedValue({ success: false, error: 'Email already exists' }); // Mock failed signup

        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );

        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
            fireEvent.change(firstNameInput, { target: { value: 'testuser' } });
            fireEvent.change(lastNameInput, { target: { value: 'lastname' } });
            fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Qwert!12' } });
            fireEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument(); // Wait for error message to appear
        });
    });
});