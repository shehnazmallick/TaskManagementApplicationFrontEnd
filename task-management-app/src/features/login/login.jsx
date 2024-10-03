import React, {useEffect, useState} from "react";
import loginService from "../../services/loginService.js";
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";


const Login = () => { // Converted to a functional component
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Now you can use the hook

    const handleSubmit = async (event) => {
        event.preventDefault();
       // try {
            const response = await loginService.login(email, password);
            if (response.success) {
                navigate('/');
            } else {
                setError(response.error);
            }
       // } catch (error) {
            //setError("An error occurred. Please try again later.");
       // }
    };

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div className="d-flex justify-content-center">
                        <span><Link to="/auth/signup">Sign Up</Link></span>
                    </div>
                    <hr/>
                    <form onSubmit={handleSubmit}>
                        <h3>Login</h3>
                        {error && <div className="text-danger">{error}</div>}
                        <div className="mb-3">
                            <label id="email-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter email"
                                aria-labelledby="email-label"
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
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;


