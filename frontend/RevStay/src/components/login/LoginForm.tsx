import axios from 'axios';
import React, { useState } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            // Send login data to the backend
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
            });
    
            // Get token and user from the response
            const { token, user } = response.data;
    
            // Save the token in localStorage for future use
            localStorage.setItem('token', token);
    
            // Set the user in state (to display on the UI, for example)
            setUser(user);
    
            console.log('User logged in:', user);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
