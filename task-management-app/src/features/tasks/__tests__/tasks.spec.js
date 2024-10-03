import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import {render, screen, fireEvent, act} from '@testing-library/react';
import Tasks from '../tasks';
import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import taskService from '../../../services/taskService';
import { describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('jqwidgets-scripts/jqwidgets/styles/jqx.base.css', () => {});
jest.mock('../../../services/taskService');
jest.mock('jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist', () => ({
    __esModule: true,
    default: () => <div data-testid="jqx-dropdownlist" />,
}));
jest.mock('../createTaskModal', () => ({
    __esModule: true,
    default: () => <div data-testid="create-task-modal" />,
}));
jest.mock('jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid', () => ({
    __esModule: true,
    jqx: {
        dataAdapter: jest.fn(),
    },
    default: ({ source }) => (
        <div data-testid="jqx-grid">
            {(source.localdata || []).map((task) => (
                <div key={task.id}>{task.title}</div>
            ))}
        </div>
    ),
}));
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Tasks Component', () => {
    let store;
    let source;

    beforeEach(() => {
        source = { // Initialize source object
            localdata: [
                { id: 1, title: 'Task 1', description: 'Description 1', status: 'Pending', dueDate: '2024-03-20' },
                { id: 2, title: 'Task 2', description: 'Description 2', status: 'In Progress', dueDate: '2024-03-22' },
            ],
            datatype: 'array',
            datafields: [
                // ... your datafields
            ]
        };
        store = mockStore({
            tasks: {
                tasks: source.localdata,
                loading: false,
                error: null,
            },
        });
        jest.clearAllMocks();
    });

    it('renders loading message when tasks are loading', () => {
        store = mockStore({
            tasks: {
                tasks: [],
                loading: true,
                error: null,
            },
        });

        render(
            <Provider store={store}>
                <Tasks />
            </Provider>
        );

        expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    it('renders error message when there is an error fetching tasks', () => {
        store = mockStore({
            tasks: {
                tasks: [],
                loading: false,
                error: 'Failed to fetch tasks',
            },
        });

        render(
            <Provider store={store}>
                <Tasks />
            </Provider>
        );

        expect(screen.getByText('Error: Failed to fetch tasks')).toBeInTheDocument();
    });

    it('opens create task modal when "Create Task" button is clicked', () => {
        render(
            <Provider store={store}>
                <Tasks />
            </Provider>
        );

        fireEvent.click(screen.getByText('Create Task'));

        expect(screen.getByTestId('create-task-modal')).toBeInTheDocument();
    });

    it('calls deleteTask and dispatches DELETE_TASK action when delete button is clicked', async () => {
        taskService.deleteTask.mockResolvedValue();
        window.confirm = jest.fn(() => true);
        render(
            <Provider store={store}>
                <Tasks />
            </Provider>
        );

        // Simulate clicking the delete button for the first task
        await act(() =>{
            window.handleDeleteTask(1); // Call the exposed function
        })

        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
        expect(taskService.deleteTask).toHaveBeenCalledWith(1);
        const expectedActions = [
            {
                "type": "FETCH_TASKS_REQUEST"
            },
            {
                "type": "FETCH_TASKS_SUCCESS"
            },
            {
                "payload": 1,
                "type": "DELETE_TASK"
            }
        ]
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('opens edit task modal when edit button is clicked', () => {
        render(
            <Provider store={store}>
                <Tasks />
            </Provider>
        );

        // Simulate clicking the edit button for the second task
        window.handleEditTaskClick(2); // Call the exposed function

        expect(screen.getByTestId('create-task-modal')).toBeInTheDocument();
    });
});