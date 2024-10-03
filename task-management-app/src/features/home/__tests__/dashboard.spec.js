import '@testing-library/jest-dom';
import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Dashboard from "../dashboard.jsx";
import {describe, it, expect, beforeEach} from "@jest/globals";
import {thunk} from "redux-thunk";

jest.mock('../../tasks/taskActions', () => ({
    fetchTaskCount: jest.fn(() => () => Promise.resolve()),
}));

const middlewares = [thunk]; // Add thunk to middlewares
const mockStore = configureStore(middlewares);

describe('Dashboard Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            tasks: {
                taskCount: {
                    totalTasks: 10,
                    totalCompletedTasks: 5,
                    totalPendingTasks: 3,
                    totalInProgressTasks: 2,
                },
                loadingCount: false,
                errorCount: null,
            },
        });
    });

    it('renders dashboard with task counts', async () => {
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Total Tasks')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('Tasks In Progress')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    it('renders loading state', async () => {
        store = mockStore({
            tasks: {
                taskCount: {},
                loadingCount: true,
                errorCount: null,
            },
        });
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );
        expect(screen.getByTestId('loading-message-1')).toBeInTheDocument();
        expect(screen.getByTestId('loading-message-2')).toBeInTheDocument();
        expect(screen.getByTestId('loading-message-2')).toBeInTheDocument();
    });

    it('renders error state', async () => {
        store = mockStore({
            tasks: {
                taskCount: {},
                loadingCount: false,
                errorCount: 'Failed to fetch data',
            },
        });

        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );
        expect(screen.getByTestId('error-message-1')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-2')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-3')).toBeInTheDocument();

    });
});
