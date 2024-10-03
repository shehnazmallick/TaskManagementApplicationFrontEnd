const initialState = {
    tasks: [],
    taskCount: {},
    loading: false,
    loadingCount: false,
    errorCount: null,
    error: null,
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TASKS_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_TASKS_SUCCESS':
            return { ...state, loading: false, tasks: action.payload };
        case 'FETCH_TASKS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [...state.tasks, action.payload],
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload)
            };
        case 'FETCH_TASK_COUNT_REQUEST':
            return { ...state, loadingCount: true, errorCount: null };
        case 'FETCH_TASK_COUNT_SUCCESS':
            return { ...state, loadingCount: false, taskCount: action.payload };
        case 'FETCH_TASK_COUNT_FAILURE':
            return { ...state, loadingCount: false, errorCount: action.payload };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        default:
        return state;
    }
};

export default taskReducer;