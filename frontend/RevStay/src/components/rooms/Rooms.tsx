import React, { useState, useEffect } from 'react'
import AddRoomModal from './AddRoomModal';
import { useParams } from 'react-router-dom';
import { postman } from '../../postman';
import RoomsTable from './RoomsTable';

import './rooms.css'

const Rooms = () => {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

    const { hotelId } = useParams<{ hotelId: string }>();

    const id = parseInt(hotelId as string);

    console.log('Hotel ID:', id);
    console.log(typeof hotelId);
    console.log(typeof id);

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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>All rooms</h1>
            <button onClick={() => setIsAddRoomModalOpen(true)}>Add New Room</button>

            <RoomsTable rooms={rooms} />

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