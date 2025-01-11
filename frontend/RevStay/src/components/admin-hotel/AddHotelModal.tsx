import React, { useState } from 'react';
import './AddHotelModal.css';
import { postman } from '../../postman';

interface HotelData {
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    amenities: string;
    rooms: any[];
    images: File[];
    rating: number;
}

interface AddHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddHotelModal: React.FC<AddHotelModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [hotel, setHotel] = useState<HotelData>({
        name: '',
        address: '',
        city: '',
        state: '',
        description: '',
        amenities: '',
        rooms: [],
        images: [],
        rating: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHotel(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setHotel(prev => ({ ...prev, images: Array.from(e.target.files!) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create FormData
            const formData = new FormData();

            // Add hotel data as JSON
            const hotelData = {
                name: hotel.name,
                address: hotel.address,
                city: hotel.city,
                state: hotel.state,
                description: hotel.description,
                amenities: hotel.amenities,
                // rating: hotel.rating
            };
            formData.append('data', JSON.stringify(hotelData));

            // Add images
            hotel.images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await postman.post('/api/v1/hotels', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200 || response.status === 201) {
                // Reset form
                setHotel({
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    description: '',
                    amenities: '',
                    rooms: [],
                    images: [],
                    rating: 0
                });

                if (onSuccess) {
                    onSuccess();
                }

                onClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create hotel');
            console.error('Error creating hotel:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Hotel</h2>
                {error && <div className="error-message">{error}</div>}
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
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={hotel.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="state">State:</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={hotel.state}
                            onChange={handleInputChange}
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
                        <label htmlFor="amenities">Amenities:</label>
                        <textarea
                            id="amenities"
                            name="amenities"
                            value={hotel.amenities}
                            onChange={handleInputChange}
                            placeholder="Enter amenities separated by commas"
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
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Adding Hotel...' : 'Add Hotel'}
                        </button>
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHotelModal;