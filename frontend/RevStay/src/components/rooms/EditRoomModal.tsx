import React, { useState, useEffect } from 'react';
import { Room, RoomType, RoomStatus } from '../../interfaces/room-interface';
import { postman } from '../../postman';
import './EditRoomModal.css';

interface EditRoomModalProps {
    room: Room;
    hotelId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({
    room,
    isOpen,
    hotelId,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({ ...room });
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log('Hotel room from edit room:', hotelId);

    useEffect(() => {
        setFormData({ ...room });
        setNewImages([]);
        setDeletedImages([]);
    }, [room]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? Number(value) :
                    value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...files]);
        }
    };

    const handleDeleteExistingImage = (imageUrl: string) => {
        setDeletedImages(prev => [...prev, imageUrl]);
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl)
        }));
    };

    const handleDeleteNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('data', JSON.stringify({
                roomNumber: formData.roomNumber,
                roomType: formData.roomType,
                pricePerNight: formData.pricePerNight,
                totalRooms: formData.totalRooms,
                status: formData.status
            }));

            if (newImages.length > 0) {
                newImages.forEach(image => {
                    formDataToSend.append('images', image);
                });
            }

            if (deletedImages.length > 0) {
                formDataToSend.append('deletedImages', JSON.stringify(deletedImages));
            }

            await postman.put(`/api/v1/hotels/${hotelId}/rooms/${room.id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            onSuccess();
        } catch (err) {
            setError('Failed to update room');
            console.error('Error updating room:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Room</h2>
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
                            step="0.01"
                            min="0"
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
                        <label htmlFor="availableRooms">Available Rooms:</label>
                        <input
                            type="number"
                            id="availableRooms"
                            name="availableRooms"
                            value={formData.availableRooms}
                            onChange={handleInputChange}
                            min="0"
                            max={formData.totalRooms}
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
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="current-images">
                        <h3>Current Images</h3>
                        <div className="images-grid">
                            {formData.images
                                .filter(img => !deletedImages.includes(img))
                                .map((img, index) => (
                                    <div key={index} className="image-container">
                                        <img src={img} alt={`Room ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="delete-image"
                                            onClick={() => handleDeleteExistingImage(img)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="new-images">Add New Images:</label>
                        <input
                            type="file"
                            id="new-images"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </div>

                    {newImages.length > 0 && (
                        <div className="new-images">
                            <h3>New Images to Add</h3>
                            <div className="images-grid">
                                {newImages.map((file, index) => (
                                    <div key={index} className="image-container">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="delete-image"
                                            onClick={() => handleDeleteNewImage(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Room'}
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

export default EditRoomModal;