// Login.js
import React, { useState } from 'react';
import axiosInstance from './axiosInstance'; // Adjust based on your setup
import axios from 'axios';

const Login = ({ onLogin, toggleRegister }) => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            });
            const { access } = response.data;
            onLogin(access); // Pass the token back to the parent component
        } catch (error) {
            setError('Invalid username or password');
            console.error('Login error:', error);
        }
    }

    return (
        <div className="login-form">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <button onClick={toggleRegister}>Register</button></p> {/* Button to switch to Register */}
        </div>
    );
};

export default Login;
