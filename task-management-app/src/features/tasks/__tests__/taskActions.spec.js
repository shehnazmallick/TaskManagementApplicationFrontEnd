import {thunk }from 'redux-thunk';
import * as actions from '../taskActions';
import taskService from '../../../services/taskService';
import configureMockStore from 'redux-mock-store';
import { describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../../services/taskService');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Task Actions', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
        jest.clearAllMocks();
    });

    describe('fetchTaskCount', () => {
        it('dispatches FETCH_TASK_COUNT_SUCCESS on successful task count fetch', async () => {
            const mockCount = 5;
            taskService.getTaskCount.mockResolvedValue(mockCount);

            await store.dispatch(actions.fetchTaskCount());

            const expectedActions = [
                { type: 'FETCH_TASK_COUNT_REQUEST' },
                { type: 'FETCH_TASK_COUNT_SUCCESS', payload: mockCount },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('dispatches FETCH_TASK_COUNT_FAILURE on failed task count fetch', async () => {
            const mockError = new Error('Failed to fetch task count');
            taskService.getTaskCount.mockRejectedValue(mockError);

            await store.dispatch(actions.fetchTaskCount());

            const expectedActions = [
                { type: 'FETCH_TASK_COUNT_REQUEST' },
                { type: 'FETCH_TASK_COUNT_FAILURE', payload: mockError.message },
            ];
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('updateTask', () => {
        it('creates UPDATE_TASK action', () => {
            const updatedTask = {
                id: 1,
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '2024-03-22',
                status: 'Completed',
            };

            const expectedAction = {
                type: 'UPDATE_TASK',
                payload: updatedTask,
            };

            expect(actions.updateTask(updatedTask)).toEqual(expectedAction);
        });
    });
});