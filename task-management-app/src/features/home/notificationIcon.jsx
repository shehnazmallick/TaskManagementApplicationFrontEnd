import React, {useState, useEffect} from 'react';
import taskService from "../../services/taskService.js";
import {Bell} from "react-bootstrap-icons";
import {Dropdown} from "react-bootstrap";

const NotificationIcon = () => {
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [dueTasks, setDueTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    //Code  to continuously monitor the due tasks and update the count
    useEffect(() => {
        const fetchDueAndOverdueTasks = async () => {
            setIsLoading(true);
            try {
                //CAll taskService to load due tasks
                const response = await taskService.getTasksWhichAreDueOrOverdue();
                setDueTasks(response.dueToday);
                setOverdueTasks(response.overDue);
                setTotalNotifications(response.dueToday.length + response.overDue.length)

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDueAndOverdueTasks();
        const intervalId = setInterval(fetchDueAndOverdueTasks, 60 * 1000);
        return () => clearInterval(intervalId); // Cleanup
    }, []);

    if (totalNotifications === 0) {
        return <Dropdown>
            <Dropdown.Toggle variant="light" id="notification-dropdown" data-testid="notification-dropdown">
                <Bell size={20}/>
                {totalNotifications > 0 && <span className="notification-badge">{totalNotifications}</span>}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {isLoading && <Dropdown.Item data-testid="loading-message">Loading...</Dropdown.Item>}
                {error && <Dropdown.Item>Error: {error.message}</Dropdown.Item>}
                {!isLoading && !error && (
                    <>
                        No due or overdue tasks.
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="danger" id="notification-dropdown">
                <Bell size={20}/>
                {totalNotifications > 0 && <span className="notification-badge">{totalNotifications}</span>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {isLoading && <Dropdown.Item data-testid="loading-message">Loading...</Dropdown.Item>}
                {error && <Dropdown.Item>Error: {error.message}</Dropdown.Item>}

                {!isLoading && !error && (
                    <>
                        {dueTasks.map(task => (
                            <Dropdown.Item key={task.id}>
                                Task {task.title} is due soon!
                            </Dropdown.Item>
                        ))}
                        {overdueTasks.map(task => (
                            <Dropdown.Item key={task.id} style={{color: 'red'}}>
                                Task {task.title} is overdue!
                            </Dropdown.Item>
                        ))}
                        {(dueTasks.length === 0 && overdueTasks.length === 0) && (
                            <Dropdown.Item>No due or overdue tasks.</Dropdown.Item>
                        )}
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationIcon;