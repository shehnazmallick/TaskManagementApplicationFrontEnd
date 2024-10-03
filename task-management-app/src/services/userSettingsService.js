// userSettingsService.js
import { updateUserSettings } from '../store/userSettingsReducer';
import instance from "./axiosInstance.js";

const API_BASE_URL = '/user';

const updateUserSettingsService = (newSettings) => {
    return async (dispatch) => {
        try {
            const response = await instance.patch(API_BASE_URL+ '/settings', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    showNotifications: newSettings.showNotifications
                }),
            });
            if (response && response.statusText === "OK") {
                dispatch(updateUserSettings(newSettings)); // Dispatch only if successful
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error updating user settings:', error);
        }
    };
};

export default updateUserSettingsService;