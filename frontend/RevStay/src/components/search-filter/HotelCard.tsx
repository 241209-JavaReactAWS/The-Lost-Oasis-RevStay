import React, { useState } from 'react';
import IHotel from '../../views/hotel/IHotel.ts';
import HotelDetails from './HotelDetails.tsx';
import { postman } from '../../postman.ts';

interface HotelCardProps {
    hotel: IHotel;
    onClose: () => void;
}

function HotelCard({ hotel, onClose }: HotelCardProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [reservationData, setReservationData] = useState<any>(null);

    const saveReservation = async () => {
        try {
            let response = await postman.post('/bookings', {
                hotelID: hotel.id,
                checkInDate: new Date(), // Replace with actual check-in date
                checkOutDate: new Date(), // Replace with actual check-out date
                numGuests: 1, // Replace with actual number of guests
            });
            setReservationData(response.data);
            setSuccess(true);
            setError(null);
        } catch (err) {
            console.log('Error saving reservation', err);
            setError('Unable to process reservation.');
            setSuccess(false);
        }
    };

    return (
        <div>
            <button onClick={onClose}>Close</button>
            <HotelDetails hotel={hotel} saveReservation={saveReservation} />
            {success && <p>Reservation saved successfully!</p>}
            {reservationData && (
                <div>
                    <p>Reservation Details:</p>
                    <pre>{JSON.stringify(reservationData, null, 2)}</pre>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default HotelCard;