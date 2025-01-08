import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
} from '@mui/material';

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isHotelOwner, setIsHotelOwner] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Determine the role based on checkbox state
            const role = isHotelOwner ? 'OWNER' : 'CUSTOMER';

            const response = await axios.post('http://localhost:8080/register', {
                firstName,
                lastName,
                email,
                password,
                phone,
                role,
            });

            setSuccess('Registration successful. Please log in.');
            setError('');
        } catch (err) {
            setError('Registration failed. Please try again.');
            setSuccess('');
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
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
            />
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
            <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Phone Number"
                type="tel"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                fullWidth
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isHotelOwner}
                        onChange={(e) => setIsHotelOwner(e.target.checked)}
                    />
                }
                label="Are you a Hotel Owner?"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ padding: '10px', fontWeight: 'bold' }}
            >
                Register
            </Button>
            {error && (
                <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
            )}
            {success && (
                <Typography variant="body2" color="success.main" sx={{ textAlign: 'center' }}>
                    {success}
                </Typography>
            )}
        </Box>
    );
};

export default RegisterForm;
