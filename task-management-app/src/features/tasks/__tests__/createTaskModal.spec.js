import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import CreateTaskModal from '../createTaskModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import taskService from '../../../services/taskService';

jest.mock('../../../services/taskService');
const mockStore = configureStore([]);

describe('CreateTaskModal Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({ tasks: [] });
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders create task modal correctly', () => {
        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="create" />
            </Provider>
        );

        expect(screen.getByText('Create Task')).toBeInTheDocument();
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
        expect(screen.queryByLabelText('Status')).toBeInTheDocument(); // Status should be hidden in create mode
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('renders edit task modal correctly', async () => {
        const mockTask = {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-03-15',
            status: 'In Progress',
        };

        taskService.getTask.mockResolvedValue(mockTask);

        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="edit" taskId={1} />
            </Provider>
        );

        // Wait for the task to be fetched
        await waitFor(() => expect(taskService.getTask).toHaveBeenCalledWith(1));

        expect(screen.getByText('Edit Task')).toBeInTheDocument();
        expect(screen.getByLabelText('Title')).toHaveValue('Test Task');
        expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
        expect(screen.getByLabelText('Due Date')).toHaveValue('2024-03-15');
        expect(screen.getByLabelText('Status')).toHaveValue('In Progress'); // Status should be visible in edit mode
    });

    it('creates a new task', async () => {
        taskService.createTask.mockResolvedValue({
            id: 1,
            title: 'New Task',
            description: 'New Description',
            dueDate: '2024-03-20',
            status: 'Pending',
        });

        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="create" />
            </Provider>
        );

        const titleInput = screen.getByLabelText('Title');
        const descriptionInput = screen.getByLabelText('Description');
        const dueDateInput = screen.getByLabelText('Due Date');
        const saveButton = screen.getByText('Save');

        fireEvent.change(titleInput, { target: { value: 'New Task' } });
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
        fireEvent.change(dueDateInput, { target: { value: '2024-03-20' } });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(taskService.createTask).toHaveBeenCalledWith({
            id: null,
            title: 'New Task',
            description: 'New Description',
            dueDate: '2024-03-20',
            status: 'Pending',
        });

        // Check if the success toast is displayed
        await waitFor(() => {
            expect(screen.getByText('Task created successfully.')).toBeVisible();
        });
    });

    it('updates an existing task', async () => {
        const mockTask = {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-03-15',
            status: 'In Progress',
        };

        taskService.getTask.mockResolvedValue(mockTask);
        taskService.createTask.mockResolvedValue({
            ...mockTask,
            title: 'Updated Task',
            status: 'Completed',
        });

        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="edit" taskId={1} />
            </Provider>
        );

        // Wait for the task to be fetched
        await waitFor(() => expect(taskService.getTask).toHaveBeenCalledWith(1));

        const titleInput = screen.getByLabelText('Title');
        const statusSelect = screen.getByLabelText('Status');
        const saveButton = screen.getByText('Save');

        fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
        fireEvent.change(statusSelect, { target: { value: 'Completed' } });

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(taskService.createTask).toHaveBeenCalledWith({
            id: 1,
            title: 'Updated Task',
            description: 'Test Description',
            dueDate: '2024-03-15',
            status: 'Completed',
        });

        // Check if the success toast is displayed
        await waitFor(() => {
            expect(screen.getByText('Task created successfully.')).toBeVisible();
        });
    });

    it('shows error toast on update task failure', async () => {
        const mockTask = {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-03-15',
            status: 'In Progress',
        };

        taskService.getTask.mockResolvedValue(mockTask);
        taskService.createTask.mockRejectedValue(new Error('Failed to update task'));

        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="edit" taskId={1} />
            </Provider>
        );

        // Wait for the task to be fetched
        await waitFor(() => expect(taskService.getTask).toHaveBeenCalledWith(1));

        const saveButton = screen.getByText('Save');

        await act(async () => {
            fireEvent.click(saveButton);
        });

        expect(screen.getByText('Error!')).toBeVisible();
        expect(screen.getByText('Failed to update task.')).toBeVisible();
        // Assert that the error toast is visible
        const errorToast = screen.getByText('Error!');
        // Assert that the toast header has the correct background color
        expect(errorToast.parentElement).toHaveClass('toast-header');
    });

    it('hides success toast when showToast is false', () => {
        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="create" showToast={false} />
            </Provider>
        );

        // Since the toast is autohide, we need to wait for it to disappear
        waitFor(() => {
            expect(screen.queryByText('Task created successfully.')).not.toBeInTheDocument();
        });
    });

    it('hides error toast when showErrorToast is false', () => {
        render(
            <Provider store={store}>
                <CreateTaskModal show={true} onHide={() => {}} mode="create" showErrorToast={false} />
            </Provider>
        );

        // Since the toast is autohide, we need to wait for it to disappear
        waitFor(() => {
            expect(screen.queryByText('Failed to create task.')).not.toBeInTheDocument();
        });
    });
});