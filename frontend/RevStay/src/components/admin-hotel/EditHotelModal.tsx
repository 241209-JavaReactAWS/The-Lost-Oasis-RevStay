import React, { useState, useEffect } from 'react';
import { postman } from '../../postman';
import './EditHotelModal.css';

interface Hotel {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    amenities: string;
    images: string[];
}

interface EditHotelModalProps {
    hotel: Hotel;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({
    hotel,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({ ...hotel });
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData({ ...hotel });
        setNewImages([]);
        setDeletedImages([]);
    }, [hotel]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDeleteImage = (imageUrl: string) => {
        setDeletedImages(prev => [...prev, imageUrl]);
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('data', JSON.stringify({
                name: formData.name,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                description: formData.description,
                amenities: formData.amenities
            }));

            newImages.forEach(image => {
                formDataToSend.append('images', image);
            });

            if (deletedImages.length > 0) {
                formDataToSend.append('deletedImages', JSON.stringify(deletedImages));
            }

            const response = await postman.put(`/api/v1/hotels/${hotel.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError('Failed to update hotel');
            console.error('Error updating hotel:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Hotel</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Hotel Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amenities">Amenities:</label>
                        <textarea
                            id="amenities"
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleInputChange}
                            placeholder="Enter amenities separated by commas"
                            required
                        />
                    </div>

                    <div className="current-images">
                        <h3>Current Images</h3>
                        <div className="images-grid">
                            {formData.images.filter(img => !deletedImages.includes(img)).map((img, index) => (
                                <div key={index} className="image-container">
                                    <img src={img} alt={`Hotel ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="delete-image"
                                        onClick={() => handleDeleteImage(img)}
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
                            name="new-images"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </div>

                    {newImages.length > 0 && (
                        <div className="new-images">
                            <h3>New Images to Add</h3>
                            <div className="images-grid">
                                {Array.from(newImages).map((file, index) => (
                                    <div key={index} className="image-container">
                                        <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="delete-image"
                                            onClick={() => setNewImages(prev =>
                                                prev.filter((_, i) => i !== index)
                                            )}
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
                            {loading ? 'Updating...' : 'Update Hotel'}
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

export default EditHotelModal;