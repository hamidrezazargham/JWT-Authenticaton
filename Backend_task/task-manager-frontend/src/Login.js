
import React, { useState } from 'react';
import axiosInstance from './axiosInstance'; // Adjust based on your setup
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toRegister = () => {
        navigate('/register');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axiosInstance.post('/tasks/login/', { username, password });
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('csrfToken', response.data.csrfToken);
            navigate('/home');
            // onLogin(response.data.token);
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
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
                <p>Don't have an account? <button onClick={toRegister}>Register</button></p>
            </div>
        </div>
    );
};

export default Login;
