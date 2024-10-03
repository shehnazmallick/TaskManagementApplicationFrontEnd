import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import taskService from "../../services/taskService.js";
import CreateTaskModal from "./createTaskModal.jsx";
import JqxDropDownList from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdropdownlist';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css'; // Or the specific theme you're using

const Tasks = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedTaskId, setSelectedTaskId] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    useEffect(() => {
        const fetchTasks = async () => {
            dispatch({ type: 'FETCH_TASKS_REQUEST' });
            try {
                const tasksData = await taskService.getTasks(currentPage, pageSize);
                dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: tasksData });
            } catch (error) {
                dispatch({ type: 'FETCH_TASKS_FAILURE', payload: error.message });
            }
        };
        fetchTasks();
    }, []);

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                setShowModal(false);
                setSelectedTaskId(null);
                await taskService.deleteTask(taskId);
                dispatch({ type: 'DELETE_TASK', payload: taskId });
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    }

    const handleCreateTaskClick = () => {
        setModalMode('create');
        setSelectedTaskId(null);
        setShowModal(true);
    };

    const handleEditTaskClick = (taskId) => {
        setModalMode('edit');
        setSelectedTaskId(taskId);
        setShowModal(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (event) => {
        const newPageSize = parseInt(event.args.value, 10);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page
    };

    const source = {
        localdata: tasks,
        datatype: 'array',
        datafields: [
            { name: 'id', type: 'number' },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'dueDate', type: 'datetime', format: 'yyyy-MM-dd' } // Assuming dueDate is a string
        ]
    };

    const dataAdapter = new jqx.dataAdapter(source);


    const columns = [
        { text: 'Title', datafield: 'title', width: '30%'}, // Use percentages for width
        { text: 'Description', datafield: 'description', width: '30%'},
        { text: 'Status', datafield: 'status', width: '10%', filterable: true },
        { text: 'Due Date', datafield: 'dueDate', width: '15%', sortable: true },
        // Adjust percentages as needed to fill 100%
        {
            text: 'Actions',
            datafield: 'id',
            cellsrenderer: (row, columnfield, value, defaulthtml, columnproperties, rowdata) => (
                `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 40px;"">
                <button class="btn btn-danger btn-sm mr-2" onclick="handleDeleteTask(${value})">
                   Delete
                </button>
                <button class="btn btn-primary btn-sm" onclick="handleEditTaskClick(${value})">
                    Edit
                </button>
            </div>`
            ),
            width: '15%' // Adjust as needed
        }
    ];

    // Expose functions to window for onclick handlers in grid
    window.handleDeleteTask = handleDeleteTask;
    window.handleEditTaskClick = handleEditTaskClick;

    if (loading) {
        return <div className="container mt-4">
            <div>Loading tasks...</div>
        </div>;
    }

    if (error) {
        return <div className="container mt-4">
            <div>Error: {error}</div>
        </div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    className="btn btn-primary"
                    onClick={handleCreateTaskClick}
                >
                    Create Task
                </button>
                <div>
                    <span className="mr-2">Page Size:</span>
                    <JqxDropDownList
                        width={80}
                        height={30}
                        source={['5', '10', '20', '50']}
                        selectedIndex={pageSize === 5 ? 0 : pageSize === 10 ? 1 : pageSize === 20 ? 2 : 3}
                        onChange={handlePageSizeChange}
                    />
                </div>
            </div>

            <JqxGrid
                width={'100%'}
                source={dataAdapter}
                columns={columns}
                filterable={true}
                showcolumnheaderlines={false}
                showsortmenuitems={false}
                showsortcolumnbackground={true}
                sortable={true} // Enable sorting at the grid level
                pageable={true}
                pagesize={pageSize}
                pagesizeoptions={['5', '10', '20', '50']}
                onPageChange={(event) => handlePageChange(event.args.pagenum + 1)} // jqxGrid starts from page 0
            />

            <CreateTaskModal
                show={showModal}
                onHide={() => setShowModal(false)}
                mode={modalMode}
                taskId={modalMode === 'edit' ? selectedTaskId : null}
            />
        </div>
    );
};

export default Tasks;