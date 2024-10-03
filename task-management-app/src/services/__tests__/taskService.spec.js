import MockAdapter from 'axios-mock-adapter';
import taskService from '../taskService';
import axiosInstance from "../axiosInstance.js";
import {describe, it, expect, afterEach, beforeEach} from "@jest/globals";

describe('taskService', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(axiosInstance); // Mock the axiosInstance directly
    });

    afterEach(() => {
        mock.restore();
    });

    it('should fetch tasks successfully', async () => {
        const currentPage = 1;
        const pageSize = 10;
        const mockTasks = [{ id: 1, title: 'Test Task' }];
        mock
            .onGet('/tasks', {
                params: {
                    page: currentPage - 1,
                    size: pageSize,
                },
            })
            .reply(200, mockTasks);

        const tasks = await taskService.getTasks(currentPage, pageSize);
        expect(tasks).toEqual(mockTasks);
    });

    it('should handle errors when fetching tasks', async () => {
        mock.onGet('/tasks').reply(500, 'Internal Server Error');

        try {
            await taskService.getTasks(1, 10);
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 500');
        }
    });

    it('should fetch a single task successfully', async () => {
        const taskId = 1;
        const mockTask = { id: taskId, title: 'Test Task' };
        mock.onGet(`/tasks/task/${taskId}`).reply(200, mockTask);

        const task = await taskService.getTask(taskId);
        expect(task).toEqual(mockTask);
    });

    it('should handle errors when fetching a single task', async () => {
        const taskId = 1;
        mock.onGet(`/tasks/task/${taskId}`).reply(404, 'Not Found');

        try {
            await taskService.getTask(taskId);
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 404');
        }
    });

    it('should create a task successfully', async () => {
        const newTask = { title: 'New Task' };
        const mockCreatedTask = { id: 1, ...newTask };
        mock.onPost('/tasks').reply(201, mockCreatedTask);

        const createdTask = await taskService.createTask(newTask);
        expect(createdTask).toEqual(mockCreatedTask);
    });

    it('should handle errors when creating a task', async () => {
        const newTask = { title: 'New Task' };
        mock.onPost('/tasks').reply(400, 'Bad Request');

        try {
            await taskService.createTask(newTask);
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 400');
        }
    });

    it('should delete a task successfully', async () => {
        const taskId = 1;
        mock.onDelete(`/tasks/${taskId}`).reply(200);

        await taskService.deleteTask(taskId);
        expect(mock.history.delete.length).toBe(1);
    });

    it('should handle errors when deleting a task', async () => {
        const taskId = 1;
        mock.onDelete(`/tasks/${taskId}`).reply(404, 'Not Found');

        try {
            await taskService.deleteTask(taskId);
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 404');
        }
    });

    it('should get the task count successfully', async () => {
        const mockCount = 5;
        mock.onGet('/tasks/count').reply(200, mockCount);

        const count = await taskService.getTaskCount();
        expect(count).toEqual(mockCount);
    });

    it('should handle errors when getting the task count', async () => {
        mock.onGet('/tasks/count').reply(500, 'Internal Server Error');

        try {
            await taskService.getTaskCount();
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 500');
        }
    });

    it('should get tasks which are due or overdue', async () => {
        const mockDueTasks = [{ id: 1, title: 'Due Task' }];
        mock.onGet('/tasks/dueStatus').reply(200, mockDueTasks);

        const dueTasks = await taskService.getTasksWhichAreDueOrOverdue();
        expect(dueTasks).toEqual(mockDueTasks);
    });

    it('should handle errors when getting tasks which are due or overdue', async () => {
        mock.onGet('/tasks/dueStatus').reply(500, 'Internal Server Error');

        try {
            await taskService.getTasksWhichAreDueOrOverdue();
        } catch (error) {
            expect(error.message).toEqual('Request failed with status code 500');
        }
    });
});