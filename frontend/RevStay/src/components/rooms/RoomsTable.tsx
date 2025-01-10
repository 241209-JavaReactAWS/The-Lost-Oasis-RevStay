import './rooms.css';



interface Room {
    id: number;
    roomNumber: string;
    roomType: string;
    pricePerNight: number;
    images: string[];
}

const RoomsTable = ({ rooms }: { rooms: Room[] }) => {
    return (
        <table className="rooms-table">
            <thead>
                <tr className="rooms-table-header">
                    <th></th>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id} className="rooms-table-header">
                        <td>
                            <img
                                src={room.images[0]} // Display first image from array
                                alt={`Room ${room.roomNumber}`}
                            />
                        </td>
                        <td>{room.roomNumber}</td>
                        <td>{room.roomType}</td>
                        <td>${room.pricePerNight}</td>
                        <td>
                            <button className="book-room">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default RoomsTable;