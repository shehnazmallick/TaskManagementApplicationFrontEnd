import instance from "./axiosInstance.js";

const API_BASE_URL = '/tasks'; // Replace with your actual backend API URL

const taskService = {
    getTasks: async (currentPage, pageSize) => {
        try {
            const response = await instance.get(API_BASE_URL, {
                params: {
                    page: currentPage - 1, // Adjust for 0-based indexing if needed
                    size: pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    getTask: async (taskId) => {
        try {
            const response = await instance.get(`${API_BASE_URL}/task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task:', error);
            throw error;
        }
    },

    createTask: async (taskData) => {
        try {
            const response = await instance.post(API_BASE_URL, taskData);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    deleteTask: async (taskId) => {
        try {
            const response = await instance.delete(`${API_BASE_URL}/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    getTaskCount: async () => {
        try {
            const response = await instance.get(`${API_BASE_URL}/count`);
            return response.data;
        } catch (error) {
            console.error('Error fetching task count:', error);
            throw error;
        }
    },

    getTasksWhichAreDueOrOverdue: async () => {
        try {
            const response = await instance.get(`${API_BASE_URL}/dueStatus`)
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
};

export default taskService;