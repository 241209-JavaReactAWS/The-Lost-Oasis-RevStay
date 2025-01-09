import React, { useState, useEffect } from 'react';
import { Hotel } from '../../interface/HotelTypes';
import './SearchHotel.css';

function SearchHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);

    useEffect(() => {
        fetch("/data/hotels.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data: Hotel[]) => setHotels(data))
            .catch((error) => {
                console.error('Error fetching hotel data:', error);
            });
    }, []);

    return (
        <div className="search-hotels">
            <h1>Search Hotels</h1>
            <div className="search-hotels-container">
                {hotels.length === 0 ? (
                    <p>No hotels found.</p>
                ) : (
                    hotels.map((hotel) => (
                        <div key={hotel.id}>
                            <img src={hotel.images[0]} alt={hotel.name} style={{ width: "200px", height: "150px" }} />
                            <h2>{hotel.name}</h2>
                            <p>{hotel.description}</p>
                            <p>Location: {hotel.city}, {hotel.state}</p>
                            <p>Rooms: {hotel.rooms}</p>
                            <p>Price: ${hotel.price} per night</p>
                            <p>Rating: {hotel.rating}</p>
                            <p>Amenities: {hotel.amenities.join(", ")}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchHotels;