import React, { useState } from 'react';
import { useNavigate } from 'react-router'
import ImageCarousel from '../rooms/ImageCarousel';
import './HotelInfo.css';

interface HotelData {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    amenities: string;
    rooms: any[];
    images: string[];
    rating: number;
}

interface HotelInfoProps {

    hotel: HotelData;
    onUpdate: (updatedHotel: HotelData) => void;
    onDelete: (hotelId: number) => void;

}


const HotelInfo: React.FC<HotelInfoProps> = ({ hotel, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedHotel, setEditedHotel] = useState<HotelData>(hotel);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleAddRooms = () => {
        if (hotel && hotel.id) {
            navigate(`/admin/hotels/${hotel.id}/rooms`);
        } else {
            console.error('Hotel ID is undefined');
        }
    }

    const handleDelete = () => {

        onDelete(hotel.id);

    };

    const handleUpdate = () => {
        onUpdate(editedHotel);
        setIsEditing(false);
    }

    const handleManageReservations = () => {
        if (hotel && hotel.id) {
            navigate(`/admin/hotels/${hotel.id}/bookings`);
        } else {
            console.error('Hotel ID is undefined');
        }
    }

    return (
        <div className="hotel-info">
            <div>
                <ImageCarousel
                    images={hotel.images}
                    altText={`Hotel ${hotel.name}`}
                    variant="detail"
                />
            </div>
            <div>
                <h2>{hotel.name}</h2>
                <p><strong>Address:</strong> {hotel.address}</p>
                <p><strong>City:</strong> {hotel.city}</p>
                <p><strong>State:</strong> {hotel.state}</p>
                <p><strong>Rating:</strong> {hotel.rating} / 5</p>
                <p><strong>Amenities:</strong> {hotel.amenities}</p>
                <p><strong>Description:</strong> {hotel.description}</p>
                <div className="button-group">
                    <button onClick={handleUpdate}>Edit</button>
                    <button onClick={handleAddRooms}>Add Rooms</button>
                    <button onClick={handleManageReservations}>Manage Reservations</button>
                    <button
                        onClick={handleDelete}
                        disabled={deleteLoading === hotel.id}
                    >
                        Delete
                    </button>
                </div>
                {deleteError && deleteLoading === hotel.id && (
                    <div className="error-message">{deleteError}</div>
                )}

            </div>
        </div>
    );
};

export default HotelInfo;
