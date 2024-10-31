// Register.js
import React, { useState } from 'react';
import axiosInstance from './axiosInstance'; // Adjust based on your setup

const Register = ({ onRegister, toggleRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/register/', { username, password });
            onRegister(response.data.token);
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="register-form">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <button onClick={toggleRegister}>Login</button></p> {/* Button to switch to Login */}
        </div>
    );
};

export default Register;
