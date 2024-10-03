import React, {useEffect, useState} from 'react';
import {Button, Modal, Form, Toast, ToastContainer} from 'react-bootstrap';
import taskService from "../../services/taskService.js";
import {useDispatch} from "react-redux";
import {updateTask} from "./taskActions.js";

const CreateTaskModal = ({show, onHide, mode, taskId}) => {
    const dispatch = useDispatch();
    const [showToast, setShowToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pending');
    const [task, setTask] = useState(null);


    useEffect(() => {
        const fetchTask = async () => { // Moved async function inside
            if (mode === 'edit') {
                try {
                    const response = await taskService.getTask(taskId);
                    setTitle(response.title);
                    setDescription(response.description);
                    setDueDate(response.dueDate);
                    setStatus(response.status);
                    setTask(response);
                } catch (error) {
                    console.error('Error fetching task:', error);
                    // Handle error, maybe set an error state
                }
            } else if (mode === 'create') {
                setTitle('');
                setDescription('');
                setDueDate('');
                setStatus('Pending');
            }
        };
        fetchTask(); // Call the async function immediately
    }, [mode, taskId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const description = formData.get('description');
        const dueDate = formData.get('dueDate');
        const status = formData.get('status');
        const id = task ? task.id : null;

        try {
            const updatedTask = await taskService.createTask({ // Assuming createTask also handles updates
                id,
                title,
                description,
                dueDate,
                status,
            });

            // Update Redux store
            if (mode === 'edit') {
                dispatch(updateTask(updatedTask));
            } else {
                dispatch({type: 'ADD_TASK', payload: updatedTask});
            }
            setShowToast(true);
            onHide();
        } catch (error) {
            // Handle errors (e.g., display an error message)
            console.error('Error creating task:', error);
            setShowErrorToast(true);
        }
    }


    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{mode === 'create' ? 'Create Task' : 'Edit Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleSubmit}>
                        {/*Validate all fields*/}
                        <Form.Group controlId="taskTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter task title" required={true}
                                          name="title"
                                          value={title} // Bind input value to state
                                          onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="taskDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter task description" name="description"
                                          required={true}
                                          value={description}
                                          onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="taskDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter task due date" name="dueDate"
                                          required={true}
                                          value={dueDate}
                                          onChange={e => setDueDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="taskStatus" hidden={mode === 'create'}>
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select" // Render as a dropdown
                                name="status"
                                aria-label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                        <br/>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                        {' '}
                        <Button variant="secondary" onClick={onHide}>
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-center" className="mt-3">
                {/* Toast for success message */}
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
                    <Toast.Header>
                        <strong className="me-auto text-white">Success!</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">Task created successfully.</Toast.Body>
                </Toast>

                <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide bg="danger">
                    <Toast.Header>
                        <strong className="me-auto text-white">Error!</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">Failed to {mode === 'create' ? 'create' : 'update'} task.</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default CreateTaskModal;