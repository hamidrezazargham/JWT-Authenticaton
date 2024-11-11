// App.js
import React, { useState } from 'react';
import TaskList from './TaskList';
import Login from './Login';
import Register from './Register'; // Import Register component
// App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
const isAuthenticated = null;


const ProtectedRoute = ({ isAuthenticated, children }) => {
    localStorage.getItem('authToken') == null ? isAuthenticated = false : isAuthenticated = true;
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }
    // Render the protected component if authenticated
    return children;
};

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Login />} />       {/* Root URL shows LoginPage */}
            <Route path="/login" element={<Login />} />   {/* Alternative login path */}
            
            {/* <Route path="/home" element={
                a != null ? <TaskList /> : <Navigate to="/login" />} />  Home page URL */}

            {/* Protected Route */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <TaskList />
                    </ProtectedRoute>
                }
            />    
            <Route path="/register" element={<Register />} />     {/* Home page URL */}
            </Routes>
        </Router>
    );
};


        // <div className="App">
        //     {isAuthenticated ? (
        //         <TaskList token={localStorage.getItem('token')} onLogout={handleLogout} />
        //     ) : (
        //         showRegister ? (
        //             <Register onRegister={handleLogin} toggleRegister={toggleRegister} /> // Pass toggle function
        //         ) : (
        //             <Login onLogin={handleLogin} toggleRegister={toggleRegister} /> // Pass toggle function
        //         )
        //     )}
        // </div>
    // );
// };

export default App;
