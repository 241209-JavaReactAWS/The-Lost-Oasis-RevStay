import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import axios from 'axios';

const Payments = () => {
    const location = useLocation();
    const { state } = location; // Get state passed from Hotel.tsx
    const { hotelId, room, userId } = state;

    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');

    const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentMethod) {
            setError('Please select a payment method.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/payments', {
                userId, 
                amount: room.pricePerNight, 
                paymentDate: new Date().toISOString(), 
                paymentMethod,
            });

            console.log('Payment successful:', response.data);
            alert('Payment successful!');

            
        } catch (err) {
            console.error('Payment failed:', err);
            setError('Failed to process the payment. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '50%',
                margin: '0 auto',
                marginTop: '2rem',
                padding: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
            }}
        >
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                Payment
            </Typography>
            <Typography variant="subtitle1">
                Hotel ID: {hotelId}
            </Typography>
            <Typography variant="subtitle1">
                Room: {room.roomType} - ${room.pricePerNight.toFixed(2)}
            </Typography>
            <Typography variant="subtitle1">
                User ID: {userId}
            </Typography>
            <Select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                displayEmpty
                fullWidth
                sx={{ marginTop: '1rem' }}
            >
                <MenuItem value="" disabled>
                    Select Payment Method
                </MenuItem>
                <MenuItem value="Vision">Vision</MenuItem>
                <MenuItem value="SenseiCard">SenseiCard</MenuItem>
                <MenuItem value="PalPay">PalPay</MenuItem>
            </Select>
            {error && (
                <Typography color="error" sx={{ textAlign: 'center', marginTop: 1 }}>
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{ padding: '10px', fontWeight: 'bold', marginTop: '1rem' }}
            >
                Confirm Payment
            </Button>
        </Box>
    );
};

export default Payments;