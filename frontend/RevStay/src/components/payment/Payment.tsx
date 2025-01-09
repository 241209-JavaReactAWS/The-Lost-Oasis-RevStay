import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const { state } = location; // Get state passed from Hotel.tsx
    const { hotelName, room, userId, totalAmount } = state; // Extract hotel name and totalAmount

    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');

    const handlePaymentMethodChange = (event: SelectChangeEvent<string>) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentMethod || !cardNumber || !cvv || !expiryDate) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/payments', {
                userId, 
                amount: totalAmount, // Use the totalAmount
                paymentDate: new Date().toISOString(), 
                paymentMethod,
                cardNumber, 
                cvv, 
                expiryDate,
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
                Hotel: {hotelName} {/* Display hotel name */}
            </Typography>
            <Typography variant="subtitle1">
                Room: {room.roomType} - ${totalAmount.toFixed(2)} {/* Display total amount */}
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
            
            <TextField
                label="Credit Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} // Remove non-digits and limit to 16
                inputProps={{
                    maxLength: 16, // Limit input to 16 digits
                }}
                fullWidth
                sx={{ marginTop: '1rem' }}
                helperText="Enter 16 digits"
            />
            
            <TextField
                label="Security Code (CVV)"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} // Limit to 3 digits
                inputProps={{
                    maxLength: 3, // Limit input to 3 digits
                }}
                fullWidth
                sx={{ marginTop: '1rem' }}
            />
            
            <TextField
                label="Expiration Date (MM/YY)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))} // Limit input to 4 digits
                inputProps={{
                    maxLength: 4, // Limit input to 4 digits
                }}
                fullWidth
                sx={{ marginTop: '1rem' }}
                helperText="Enter expiration date as MMYY"
            />

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

export default Payment;