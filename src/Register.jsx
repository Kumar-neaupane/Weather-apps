/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./components/LR.css";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registration functionality not implemented.");
    navigate("/login");
  };

  return (
    <div className="LR">
         
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login" className="lk">Login</Link> or <Link className="lk" to="/" style={{ marginRight: "10px" }}>Return to Home</Link></p>
    </div>
  );
};

export default Register;
*/



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./components/LR.css";

const Register = ({ setUsername }) => {
    const [inputUsername, setInputUsername] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        setUsername(inputUsername);
        localStorage.setItem("username", inputUsername); // Optional
        navigate("/weather");
    };

    return (
        <div className="LR">
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Enter Username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
            />
            <input type="email" placeholder="Enter Email"/>
            
            <input type="password" placeholder="Enter Password" />
            <button onClick={handleRegister}>Register</button>
            <p>
            Already have an account? <Link to="/" className="lk">Login</Link> or <Link className="lk" to="/weather" style={{ marginRight: "10px" }}>Use Without Login</Link>
            </p>
        </div>
    );
};

export default Register;
