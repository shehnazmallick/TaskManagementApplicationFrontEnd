import taskService from "../../services/taskService.js";

export const fetchTaskCount = () => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_TASK_COUNT_REQUEST' });
        try {
            const count = await taskService.getTaskCount();
            dispatch({ type: 'FETCH_TASK_COUNT_SUCCESS', payload: count });
        } catch (error) {
            dispatch({ type: 'FETCH_TASK_COUNT_FAILURE', payload: error.message });
        }
    };
};

export const updateTask = (updatedTask) => ({
    type: 'UPDATE_TASK',
    payload: updatedTask,
});
