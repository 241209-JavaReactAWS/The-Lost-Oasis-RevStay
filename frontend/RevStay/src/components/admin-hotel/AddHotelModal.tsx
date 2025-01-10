import React, { useState } from 'react';
import './AddHotelModal.css';


interface HotelData {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    amenities: string;
    // owner?: User;
    rooms: any[];
    images: File[];
    rating: number;
}

interface AddHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddHotel: (hotel: Omit<HotelData, 'id'> & { images: File[] }) => void;
}

const AddHotelModal: React.FC<AddHotelModalProps> = ({ isOpen, onClose, onAddHotel }) => {
    const [hotel, setHotel] = useState<HotelData>({
        id: '',
        name: '',
        address: '',
        city: '',
        state: '',
        description: '',
        amenities: '',
        rooms: [],
        images: [],
        rating: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHotel(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rating = Math.min(5, Math.max(0, Number(e.target.value)));
        setHotel(prev => ({ ...prev, rating }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setHotel(prev => ({ ...prev, images: Array.from(e.target.files!) }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddHotel(hotel);
        setHotel({ id: '', name: '', address: '', city: '', state: '', description: '', amenities: '', rooms: [], images: [], rating: 0 });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Hotel</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Hotel Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={hotel.name}
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
                            value={hotel.address}
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
                            min="0"
                            max="5"
                            step="0.1"
                            value={hotel.rating}
                            onChange={handleRatingChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={hotel.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="images">Images:</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Add Hotel</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHotelModal;