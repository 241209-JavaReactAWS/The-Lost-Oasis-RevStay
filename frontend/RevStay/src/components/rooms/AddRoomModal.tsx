
import React, { useState } from 'react';
import { postman } from '../../postman';
import './AddRoomModal.css';

enum RoomType {
    SINGLE = 'SINGLE',
    DOUBLE = 'DOUBLE',
    SUITE = 'SUITE',
    DELUXE = 'DELUXE',
    EXECUTIVE = 'EXECUTIVE',
    FAMILY = 'FAMILY'
}

enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    UNDER_MAINTENANCE = 'UNDER_MAINTENANCE'
}

interface RoomData {
    roomNumber: string;
    roomType: RoomType;
    pricePerNight: number;
    isAvailable: boolean;
    totalRooms: number;
    availableRooms: number;
    status: RoomStatus;
    images: File[];
}

interface AddRoomModalProps {
    hotelId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ hotelId, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<RoomData>({
        roomNumber: '',
        roomType: RoomType.SINGLE,
        pricePerNight: 0,
        isAvailable: true,
        totalRooms: 1,
        availableRooms: 1,
        status: RoomStatus.AVAILABLE,
        images: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) :
                type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                images: Array.from(e.target.files!)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!hotelId) {
            setError('Hotel ID is missing');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('data', JSON.stringify({
                roomNumber: formData.roomNumber,
                roomType: formData.roomType,
                pricePerNight: formData.pricePerNight,
                totalRooms: formData.totalRooms,
                status: formData.status
            }));

            if (formData.images.length > 0) {
                formData.images.forEach((image) => {
                    formDataToSend.append(`images`, image);
                });
            }

            const response = await postman.post(`/api/v1/hotels/${hotelId}/rooms`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200 || response.status === 201) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError('Failed to create room');
            console.error('Error creating room:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Room</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="roomNumber">Room Number:</label>
                        <input
                            type="text"
                            id="roomNumber"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="roomType">Room Type:</label>
                        <select
                            id="roomType"
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleInputChange}
                            required
                        >
                            {Object.values(RoomType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pricePerNight">Price Per Night:</label>
                        <input
                            type="text"
                            id="pricePerNight"
                            name="pricePerNight"
                            value={formData.pricePerNight}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="totalRooms">Total Rooms:</label>
                        <input
                            type="number"
                            id="totalRooms"
                            name="totalRooms"
                            value={formData.totalRooms}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                        >
                            {Object.values(RoomStatus).map(status => (
                                <option key={status} value={status}>{status.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="images">Room Images:</label>
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

                    {formData.images.length > 0 && (
                        <div className="images-preview">
                            <h3>Selected Images:</h3>
                            <div className="images-grid">
                                {Array.from(formData.images).map((file, index) => (
                                    <div key={index} className="image-container">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Adding Room...' : 'Add Room'}
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

export default AddRoomModal;