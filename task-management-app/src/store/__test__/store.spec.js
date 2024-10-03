// store.test.js
import store from '../store'; // Import your store
import taskReducer from '../taskReducer'; // Import your task reducer
import userSettingsReducer from '../userSettingsReducer'; // Import your user settings reducer
import {describe, it, expect} from "@jest/globals";

describe('Redux Store', () => {
    it('should have the correct initial state', () => {
        const state = store.getState();
        expect(state).toEqual({
            tasks: taskReducer(undefined, {}), // Call reducer with undefined state to get initial state
            userSettings: userSettingsReducer(undefined, {}), // Same for user settings
        });
    });
});
