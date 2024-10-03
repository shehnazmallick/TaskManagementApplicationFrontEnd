import '@testing-library/jest-dom';
import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import UserSettings from '../userSettings';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import updateUserSettingsService from '../../../services/userSettingsService';
import {thunk} from "redux-thunk";

jest.mock('../../../services/userSettingsService');

const mockStore = configureStore([thunk]);

describe('UserSettings Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({ userSettings: { showNotifications: false } });
        localStorage.setItem('username', 'TestUser');
        const userSettings = JSON.stringify({ showNotifications: false });
        localStorage.setItem('userSettings', userSettings );
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('renders user settings with initial state from Redux', () => {
        render(
            <Provider store={store}>
                <UserSettings />
            </Provider>
        );

        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByLabelText('Show Notifications')).not.toBeChecked();
    });

    it('dispatches updateUserSettingsService when notification toggle changes', async () => {
        const dispatchMock = jest.fn();
        store = mockStore({ userSettings: { showNotifications: false } }, { dispatch: dispatchMock });
        updateUserSettingsService.mockImplementation((settings) => (dispatch) => {
            dispatch({ type: 'userSettings/updateUserSettings', payload: settings }); // Replace 'userSettings/updateUserSettings' with your actual action type
        });
        render(
            <Provider store={store}>
                <UserSettings />
            </Provider>
        );

        const toggleSwitch = screen.getByTestId('settings-notification-toggle');
        await act(async () => {
            fireEvent.click(toggleSwitch);
        })

        expect(updateUserSettingsService).toHaveBeenCalledWith({ showNotifications: true });
    });
});