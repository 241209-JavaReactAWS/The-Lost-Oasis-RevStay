import React, { useState } from 'react';
import './AddRoomModal.css';

interface AddRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddRoom: (room: { name: string; capacity: number; amenities: string }) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAddRoom }) => {
    const [roomName, setRoomName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [amenities, setAmenities] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddRoom({
            name: roomName,
            capacity: parseInt(capacity),
            amenities: amenities
        });
        // Reset form fields
        setRoomName('');
        setCapacity('');
        setAmenities('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Room</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="roomName">Room Name:</label>
                        <input
                            type="text"
                            id="roomName"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="capacity">Capacity:</label>
                        <input
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amenities">Amenities:</label>
                        <textarea
                            id="amenities"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                            placeholder="Enter amenities separated by commas"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Add Room</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomModal;