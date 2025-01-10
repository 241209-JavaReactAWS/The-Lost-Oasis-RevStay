import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import IRoom from '../room/IRoom.tsx';

interface ReservationState {
    hotelId: string;
    room: IRoom;
    checkInDate: string;
    checkOutDate: string;
    numGuests: number;
    totalPrice: number;
}

const Reservation: React.FC = () => {
    const location = useLocation();
    const state = location.state as ReservationState;

    return (
        <Box sx={{ my: 3 }}>
            <Typography variant='h4'>Reservation Confirmation</Typography>
            <Typography variant='h5' sx={{ my: 2 }}>{state.room.roomType}</Typography>
            <Typography>Hotel ID: {state.hotelId}</Typography>
            <Typography>Room Number: {state.room.roomNumber}</Typography>
            <Typography>Check-in Date: {state.checkInDate}</Typography>
            <Typography>Check-out Date: {state.checkOutDate}</Typography>
            <Typography>Number of Guests: {state.numGuests}</Typography>
            <Typography>Total Price: ${state.totalPrice}</Typography>
        </Box>
    );
};

export default Reservation;