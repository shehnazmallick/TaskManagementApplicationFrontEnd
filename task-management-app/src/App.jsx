import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom'
import Login from "./features/login/login.jsx";
import SignUp from "./features/signup/signup.jsx";
import HomePage from "./features/home/home.jsx";
import Dashboard from "./features/home/dashboard.jsx";
import Tasks from "./features/tasks/tasks.jsx";
import UserSettings from "./features/home/userSettings.jsx";

function App() {

    return (
        <Router>
            <div className="App">
                    <Routes>
                        {/* Authentication Routes */}
                        <Route path="/auth">
                            <Route index element={<Login/>}/>
                            <Route path="login" element={<Login/>}/>
                            <Route path="signup" element={<SignUp/>}/>
                        </Route>

                        <Route path="/" element={<HomePage />} >
                            <Route index element={<Dashboard/>}/>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="tasks" element={<Tasks/>}/>
                            <Route path="user-settings" element={<UserSettings/>}/>
                        </Route>
                    </Routes>
            </div>
        </Router>
    )
}

export default App