import React from 'react';
import IHotel from '../../views/hotel/IHotel.ts';
import IRoom from '../room/IRoom.ts';
import { Button } from '@mui/material';

export interface HotelDetailsProps {
    hotel: IHotel;
    saveReservation: () => void;
}

function HotelDetails({ hotel, saveReservation }: HotelDetailsProps) {
    console.log('Rendering HotelDetails component');
    console.log('Hotel:', hotel);

    return (
        <div>
            <h2>{hotel.name}</h2>
            <img src={hotel.images[0]} alt={hotel.name} />
            <p>{hotel.description}</p>
            <p>Location: {hotel.city}, {hotel.state}</p>
            <p>Amenities: {hotel.amenities}</p>
            <p>Rating: {hotel.rating}</p>
            <h3>Rooms</h3>
            <ul>
                {hotel.rooms.map((room: IRoom) => (
                    <li key={room.id}>
                        <h4>{room.roomType}</h4>
                        <p>Price: {room.pricePerNight}</p>
                        <p>Capacity: {room.roomType}</p>
                    </li>
                ))}
            </ul>
            <Button onClick={saveReservation}>Reserve</Button>
        </div>
    );
}

export default HotelDetails;