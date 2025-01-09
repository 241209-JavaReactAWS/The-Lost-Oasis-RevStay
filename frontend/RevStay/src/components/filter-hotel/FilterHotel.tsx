import React, { useState, useEffect } from 'react';
import { Hotel } from '../../interface/HotelTypes';

function FilterHotels() {
    const [criteria, setCriteria] = useState({ location: '', minPrice: 0, maxPrice: 0 });
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

    useEffect(() => {
        fetch("/data/hotels.json")
            .then((res) => res.json())
            .then((data: Hotel[]) => setHotels(data));
    }, []);

    const handleFilter = () => {
        const filtered = hotels.filter(hotel => 
            hotel.city.toLowerCase().includes(criteria.location.toLowerCase()) &&
            hotel.price >= criteria.minPrice &&
            hotel.price <= criteria.maxPrice
        );
        setFilteredHotels(filtered);
    };

    return (
        <div>
            <h1>Filter Hotels</h1>
            <div>
                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    type="text"
                    placeholder="Location"
                    value={criteria.location}
                    onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                />
                <label htmlFor="minPrice">Min Price</label>
                <input
                    id="minPrice"
                    type="number"
                    placeholder="Min Price"
                    value={criteria.minPrice}
                    onChange={(e) => setCriteria({ ...criteria, minPrice: parseInt(e.target.value) })}
                />
                <label htmlFor="maxPrice">Max Price</label>
                <input
                    id="maxPrice"
                    type="number"
                    placeholder="Max Price"
                    value={criteria.maxPrice}
                    onChange={(e) => setCriteria({ ...criteria, maxPrice: parseInt(e.target.value) })}
                />
                <button onClick={handleFilter}>Filter</button>
            </div>
            <div>
                {filteredHotels.length === 0 ? (
                    <p>No hotels found.</p>
                ) : (
                    filteredHotels.map((hotel) => (
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

export default FilterHotels;