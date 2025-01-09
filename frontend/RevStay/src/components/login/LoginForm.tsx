import axios from 'axios';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.id);
            setUser(user);
            console.log('User logged in:', user);

            if (user.role === 'OWNER') {
                window.location.href = '/owner-dashboard';
            } else if (user.role === 'CUSTOMER') {
                window.location.href = '/customer-dashboard';
            }
            
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: '10px', fontWeight: 'bold' }}
            >
                Login
            </Button>
            {error && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{ textAlign: 'center', marginTop: 1 }}
                >
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default LoginForm;
