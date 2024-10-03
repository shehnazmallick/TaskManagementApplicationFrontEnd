import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import NotificationIcon from "./notificationIcon.jsx";
import {Dropdown} from "react-bootstrap";
import {PersonCircle} from "react-bootstrap-icons";
import {useSelector} from "react-redux";

const HomePage = () => {
    const navigate = useNavigate();
    const showNotifications = useSelector(state => state.userSettings.showNotifications);

    const handleLogout = () => {
        Cookies.remove('token', {path: '/'}); // Remove JWT cookie
        Cookies.remove('userId', {path: '/'}); // Remove JWT cookie
        localStorage.clear(); // Clear local storage
        navigate('/auth/login'); // Redirect to login page
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        Task Manager
                    </a>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
                            </li>
                            <li className="nav-item"> {/* Add nav-item class */}
                                <a className="nav-link" href="/tasks">Tasks</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            {showNotifications && (
                                <>
                                    <li className="nav-item" data-testid="notification-icon">
                                        <NotificationIcon></NotificationIcon>
                                    </li>
                                </>
                            )}
                            <li className="nav-item dropdown"> {/* User dropdown */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="user-dropdown" data-testid="user-dropdown">
                                        <PersonCircle size={20} data-testid="person-circle"/> {/* User icon */}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end"> {/* Align to the right */}
                                        <Dropdown.Item href="/user-settings">User
                                            Settings</Dropdown.Item> {/* Link to user settings */}
                                        <Dropdown.Divider/> {/* Separator */}
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Outlet/>
            </div>
        </div>
    )
        ;
};

export default HomePage;