import taskReducer from "./taskReducer.js";
import {configureStore} from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import userSettingsReducer from "./userSettingsReducer.js";

const store = configureStore({
    reducer: {
        tasks: taskReducer,
        userSettings: userSettingsReducer,
        // ...other reducers for different parts of your application
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk), // Add middleware if needed
});

export default store;