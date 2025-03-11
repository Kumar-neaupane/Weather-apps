
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import "./components/LR.css";
const Login = ({ setUsername }) => {
    const [inputUsername, setInputUsername] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        setUsername(inputUsername);
        localStorage.setItem("username", inputUsername); // Optional: Store in cache
        navigate("/weather");
    };

    return (
        <div className="LR">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Enter Username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
            />
            <input type="password" placeholder="Enter Password" />
            <button onClick={handleLogin}>Login</button>
            <p>
            Don't have an account? <Link to="/register" className="lk">Register</Link> or <Link to="/weather" className="lk" style={{ marginRight: "10px" }}>Use Without Login</Link> 
            </p>
        </div>
    );
};

export default Login;
