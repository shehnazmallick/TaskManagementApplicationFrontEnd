import React, {useState} from 'react';
import loginService from "../../services/loginService.js";
import {Link, useNavigate} from "react-router-dom";

const SignUp = () => { // Functional component
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validatePassword(password)) {
            setPasswordError('Password must be 8 characters long and contain at least one uppercase letter, one digit, and one special character.');
        } else {
            setPasswordError('');
            loginService.signUp(email, password, firstName, lastName).then(
                (response) => {
                    if (!response.success) {
                        setError(response.error); // Set the error state
                    } else {
                        navigate('/auth/login');
                    }
                }
            )
            console.log('Signup successful!');
        }
    }

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8}$/;
        return passwordRegex.test(password);
    }

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div className="d-flex justify-content-center">
                        <span><Link to="/auth/login">Login</Link></span>
                    </div>
                    <hr/>
                    <form onSubmit={handleSubmit}>
                        <h3 data-testid="signup-header">Sign Up</h3>
                        {error && <div className="text-danger">{error}</div>} {/* Display error */}
                        <div className="mb-3">
                            <label id="firstName-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                autoFocus
                                aria-labelledby="firstName-label"
                            />
                        </div>
                        <div className="mb-3">
                            <label id="lastName-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                value={lastName}
                                aria-labelledby="lastName-label"
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label id="email-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                aria-labelledby="email-label"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label id="password-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                aria-labelledby="password-label"
                                onChange={handlePasswordChange}
                                required
                            />
                            {passwordError && (
                                <div className="text-danger">{passwordError}</div>
                            )}
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp;