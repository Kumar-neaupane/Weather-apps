import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Weather from "./components/Weather";
import Login from "./Login";
import Register from "./Register";

function App() {

  const [username, setUsername] = useState(localStorage.getItem("username") || ""); 

  return (
    <Router>
      <div className="App">
        
      
        <Routes>
        <Route path="/weather" element={<Weather username={username} />} />
       <Route path="/" element={<Login setUsername={setUsername} />} />
       <Route path="/register" element={<Register setUsername={setUsername} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
