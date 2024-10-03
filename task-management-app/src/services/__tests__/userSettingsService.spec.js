import {thunk} from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import updateUserSettingsService from '../userSettingsService'; // Import the service
import { updateUserSettings } from '../../store/userSettingsReducer'; // Import your action
import instance from '../axiosInstance'; // Import the axios instance
import {describe, it, expect, beforeEach} from "@jest/globals";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
jest.mock('../axiosInstance'); // Mock the axios instance

describe('updateUserSettingsService', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
        jest.clearAllMocks(); // Clear previous mocks
    });

    it('should dispatch updateUserSettings action on successful API call', async () => {
        const newSettings = { showNotifications: true };
        instance.patch.mockResolvedValueOnce({ statusText: "OK" }); // Mock successful API response

        await store.dispatch(updateUserSettingsService(newSettings));

        const actions = store.getActions(); // Get dispatched actions
        expect(actions).toEqual([
            updateUserSettings(newSettings), // Expect the action to be dispatched
        ]);
        expect(instance.patch).toHaveBeenCalledWith('/user/settings', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ showNotifications: true }),
        });
    });

    it('should handle API errors gracefully', async () => {
        const newSettings = { showNotifications: false };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(); // Spy on console.error
        instance.patch.mockRejectedValueOnce(new Error('Network Error')); // Mock API error

        await store.dispatch(updateUserSettingsService(newSettings));

        expect(consoleSpy).toHaveBeenCalledWith('Error updating user settings:', expect.any(Error)); // Check for console error
        consoleSpy.mockRestore(); // Restore the original console.error
    });

    it('should throw error for unexpected API response', async () => {
        const newSettings = { showNotifications: true };
        instance.patch.mockResolvedValueOnce({ statusText: "ERROR" }); // Mock unexpected response

        await store.dispatch(updateUserSettingsService(newSettings));

        const actions = store.getActions();
        expect(actions).toEqual([]); // No actions should be dispatched on error
    });
});
