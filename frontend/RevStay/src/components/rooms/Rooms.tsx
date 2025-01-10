import React, { useState, useEffect } from 'react'
import AddRoomModal from './AddRoomModal';
import { postman } from '../../postman';
import RoomsTable from './RoomsTable';

import './rooms.css'

const Rooms = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await postman.get('/api/v1/hotels/1/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleAddRoom = (room: { name: string; capacity: number; amenities: string }) => {

        console.log('New room details:', room);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>All rooms</h1>
            <button onClick={() => setIsModalOpen(true)}>Add New Room</button>

            <AddRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddRoom={handleAddRoom}
            />

            <RoomsTable rooms={rooms} />


        </div>

    )
}

export default Rooms