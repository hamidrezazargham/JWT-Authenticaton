import React, { useState } from 'react';
import axiosInstance from './axiosInstance'; // Adjust based on your setup
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toLogin = () => {
        navigate('/login');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/register/', { username, password });
            alert('User Created.');
            toLogin();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                // Assuming 409 status code means "User already exists"
                alert('User already exists. Please try a different username.');
            } else {
                setError('Registration failed. Please try again.');
                console.error(err);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                    <button type="submit" className="submit-button">Register</button>
                </form>
                <p className="switch-login">
                    Already have an account?{' '}
                    <button onClick={toLogin} className="login-button">Login</button>
                </p>
            </div>
        </div>
    );
};

export default Register;
