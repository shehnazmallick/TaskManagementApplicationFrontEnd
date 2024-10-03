// userSettingsReducer.js (renamed from userSettingsReducer.js)
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    showNotifications: true,
};

const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState,
    reducers: {
        updateUserSettings: (state, action) => {
            // Update local storage whenever Redux state changes
            localStorage.setItem('userSettings', JSON.stringify(action.payload));

            // Merge the new settings into the existing state
            return {...state, ...action.payload};
        },
    },
});

export const {updateUserSettings} = userSettingsSlice.actions;
export default userSettingsSlice.reducer;