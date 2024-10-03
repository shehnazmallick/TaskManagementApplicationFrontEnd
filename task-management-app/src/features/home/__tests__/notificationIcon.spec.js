import '@testing-library/jest-dom';
import React from 'react';
import {fireEvent, render, screen, waitFor, act} from '@testing-library/react';
import NotificationIcon from "../notificationIcon.jsx";
import taskService from "../../../services/taskService.js";
import {afterEach, describe, it, expect} from "@jest/globals";

// Mock the taskService
jest.mock('../../../services/taskService');

describe('NotificationIcon Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    it('renders loading state initially', async () => {
        taskService.getTasksWhichAreDueOrOverdue.mockReturnValue(new Promise(() => {})); // Mock a pending promise
        render(<NotificationIcon />);
        // Find the dropdown toggle button (you might need to adjust the query)
        const dropdownToggle = screen.getByTestId('notification-dropdown');
        // Assert that the menu is initially closed
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        // Click the toggle button
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })
        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        });
    });

    it('displays error message when fetching tasks fails', async () => {
        taskService.getTasksWhichAreDueOrOverdue.mockRejectedValue(new Error('Network error'));

        render(<NotificationIcon />);
        const dropdownToggle = screen.getByTestId('notification-dropdown');
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })
        // Wait for loading to complete
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });

    it('displays no due or overdue tasks', async () => {
        taskService.getTasksWhichAreDueOrOverdue.mockResolvedValue({
            dueToday: [],
            overDue: [],
        });

        render(<NotificationIcon />);
        const dropdownToggle = screen.getByTestId('notification-dropdown');
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })

        // Wait for loading to complete
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        expect(screen.getByText('No due or overdue tasks.')).toBeInTheDocument();
    });

    it('displays due and overdue tasks', async () => {
        const dueTasks = [{ id: 1, title: 'Task 1' }];
        const overdueTasks = [{ id: 2, title: 'Task 2' }];
        taskService.getTasksWhichAreDueOrOverdue.mockResolvedValue({
            dueToday: dueTasks,
            overDue: overdueTasks,
        });

        render(<NotificationIcon />);
        const dropdownToggle = screen.getByTestId('notification-dropdown');
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })

        // Wait for loading to complete
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        expect(screen.getByText('Task Task 1 is due soon!')).toBeInTheDocument();
        expect(screen.getByText('Task Task 2 is overdue!')).toBeInTheDocument();
    });

    it('shows correct notification count', async () => {
        const dueTasks = [{ id: 1, title: 'Task 1' }];
        const overdueTasks = [{ id: 2, title: 'Task 2' }];
        taskService.getTasksWhichAreDueOrOverdue.mockResolvedValue({
            dueToday: dueTasks,
            overDue: overdueTasks,
        });

        render(<NotificationIcon />);
        const dropdownToggle = screen.getByTestId('notification-dropdown');
        await act(async () => {
            fireEvent.click(dropdownToggle);
        })

        // Wait for loading to complete
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        expect(screen.getByText('2')).toBeInTheDocument(); // Check the notification count
    });
});
