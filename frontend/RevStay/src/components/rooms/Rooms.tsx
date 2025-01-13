import React, { useState, useEffect } from 'react'
import AddRoomModal from './AddRoomModal';
import { useParams } from 'react-router-dom';
import { postman } from '../../postman';
import RoomsTable from './RoomsTable';
import EditRoomModal from './EditRoomModal';
import { Room } from '../../interfaces/room-interface';

import './rooms.css'

const Rooms = () => {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { hotelId } = useParams<{ hotelId: string }>();
    const id = parseInt(hotelId as string);

    const fetchRooms = async () => {
        try {
            const response = await postman.get(`/api/v1/hotels/${id}/rooms`);
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const handleRoomAdded = () => {
        fetchRooms(); // Refresh the list
        setIsAddRoomModalOpen(false);
    };

    const handleEditClick = (room: Room) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        fetchRooms(); // Refresh the list
        setIsEditModalOpen(false);
        setSelectedRoom(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="rooms-container">
            <div className="rooms-header">
                <h1>All rooms</h1>
                <button
                    className="add-room-button"
                    onClick={() => setIsAddRoomModalOpen(true)}>
                    Add New Room
                </button>
            </div>

            <RoomsTable
                rooms={rooms}
                onRoomDeleted={fetchRooms}
                onEditClick={handleEditClick}
            />

            {selectedRoom && (
                <EditRoomModal
                    room={selectedRoom}
                    hotelId={id}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedRoom(null);
                    }}
                    onSuccess={handleEditSuccess}
                />
            )}

            {isAddRoomModalOpen && (
                <AddRoomModal
                    hotelId={id}
                    isOpen={isAddRoomModalOpen}
                    onClose={() => setIsAddRoomModalOpen(false)}
                    onSuccess={handleRoomAdded}
                />
            )}
        </div>

    )
}

export default Rooms