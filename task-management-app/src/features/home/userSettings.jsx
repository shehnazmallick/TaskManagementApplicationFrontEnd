import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import updateUserSettingsService from "../../services/userSettingsService.js"; // Assuming you have a slice for user settings

const UserSettings = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [showNotifications, setShowNotifications] = useState(true);

    useEffect(() => {
        // Get username and notification preference from wherever you store it (e.g., local storage)
        const storedUsername = localStorage.getItem('username');
        const storedUserSettings = localStorage.getItem('userSettings');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedUserSettings != null) {
            const userSettings = JSON.parse(storedUserSettings);
            setShowNotifications(userSettings.showNotifications);
        }
    }, []);

    const handleNotificationToggle = (event) => {
        const isChecked = event.target.checked;
        setShowNotifications(isChecked);
        dispatch(updateUserSettingsService({ showNotifications: isChecked }));
    };

    return (
        <div className="container mt-4">
            <h2>{username}</h2>
            <hr />
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="showNotificationsToggle"
                    checked={showNotifications}
                    onChange={handleNotificationToggle}
                />
                <label className="form-check-label" htmlFor="showNotificationsToggle" data-testid="settings-notification-toggle">
                    Show Notifications
                </label>
            </div>
        </div>
    );
};

export default UserSettings;