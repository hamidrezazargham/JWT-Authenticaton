// App.js
import React, { useState } from 'react';
import TaskList from './TaskList';
import Login from './Login';
import Register from './Register'; // Import Register component

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [showRegister, setShowRegister] = useState(false); // State to toggle between Login and Register

    const handleLogin = (token) => {
        setToken(token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token'); // Remove access token on logout
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    const toggleRegister = () => {
        setShowRegister(!showRegister); // Toggle between Login and Register
    };

    return (
        <div className="App">
            {isAuthenticated ? (
                <TaskList token={localStorage.getItem('token')} onLogout={handleLogout} />
            ) : (
                showRegister ? (
                    <Register onRegister={handleLogin} toggleRegister={toggleRegister} /> // Pass toggle function
                ) : (
                    <Login onLogin={handleLogin} toggleRegister={toggleRegister} /> // Pass toggle function
                )
            )}
        </div>
    );
};

export default App;
