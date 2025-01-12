import React, { useState } from 'react';
import { postman } from '../../postman';
import { useParams } from 'react-router-dom';
import './rooms.css';
import { Room, RoomType, RoomStatus } from '../../interfaces/room-interface';


interface RoomsTableProps {
    rooms: Room[];
    onRoomDeleted: () => void;
    onEditClick: (room: Room) => void;
}

const RoomsTable = ({ rooms, onRoomDeleted, onEditClick }: RoomsTableProps) => {
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { hotelId } = useParams<{ hotelId: string }>();
    const id = parseInt(hotelId as string);

    const handleDeleteRoom = async (roomId: number) => {
        if (!window.confirm('Are you sure you want to delete this room?')) {
            return;
        }

        try {
            setDeleteLoading(roomId);
            setError(null);

            await postman.delete(`/api/v1/hotels/${id}/rooms/${roomId}`);
            onRoomDeleted();

        } catch (err) {
            setError('Failed to delete room');
            console.error('Error deleting room:', err);
        } finally {
            setDeleteLoading(null);
        }
    };
    return (
        <>
            {error && <div className="error-message">{error}</div>}


            <table className="rooms-table">
                <thead>
                    <tr className="rooms-table-header">
                        <th></th>
                        <th>Room Number</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Total Rooms</th>
                        <th>Available Rooms</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id} className="rooms-table-header">
                            <td>
                                <img
                                    src={room.images[0]}
                                    alt={`Room ${room.roomNumber}`}
                                />
                            </td>
                            <td>{room.roomNumber}</td>
                            <td>{room.roomType}</td>
                            <td>${room.pricePerNight}</td>
                            <td>
                                <span className={`status-badge status-${room.status.toLowerCase()}`}>
                                    {room.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td>{room.totalRooms}</td>
                            <td>{room.availableRooms}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => onEditClick(room)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteRoom(room.id)}
                                    disabled={deleteLoading === room.id}
                                >
                                    {deleteLoading === room.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default RoomsTable;