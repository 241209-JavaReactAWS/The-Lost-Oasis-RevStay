import React, { useState } from 'react';
import { useNavigate } from 'react-router'
import './HotelInfo.css';

interface HotelData {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    amenities: string;
    // owner?: User;
    rooms: any[]; // You can create a Room interface if needed
    images: string[];
    rating: number;
}

interface HotelInfoProps {

    hotel: HotelData;
    onUpdate: (updatedHotel: HotelData) => void;
    onDelete: (hotelId: string) => void;

}


const HotelInfo: React.FC<HotelInfoProps> = ({ hotel, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedHotel, setEditedHotel] = useState<HotelData>(hotel);

    const navigate = useNavigate();

    const handleAddRooms = () => {
        navigate(`/admin/hotels/${hotel.id}/rooms`);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedHotel(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(editedHotel);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            onDelete(hotel.id);
        }
    };

    if (isEditing) {
        return (
            <div className="hotel-info editing">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editedHotel.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={editedHotel.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="rating">Rating:</label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            min="1"
                            max="5"
                            value={editedHotel.rating}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={editedHotel.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="hotel-info">
            <img src={hotel.images[0]} alt="" />
            <h2>{hotel.name}</h2>
            <p><strong>Address:</strong> {hotel.address}</p>
            <p><strong>Rating:</strong> {hotel.rating} / 5</p>
            <p><strong>Description:</strong> {hotel.description}</p>
            <div className="button-group">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleAddRooms}>Add Rooms</button>
            </div>
        </div>
    );
};

export default HotelInfo;
