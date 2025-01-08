import React, { useState } from 'react'
import AddRoomModal from './AddRoomModal';

import './rooms.css'

const Rooms = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddRoom = (room: { name: string; capacity: number; amenities: string }) => {

        console.log('New room details:', room);
    };

    return (
        <div>
            <h1>All rooms</h1>
            <button onClick={() => setIsModalOpen(true)}>Add New Room</button>

            <AddRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddRoom={handleAddRoom}
            />
            <table className="rooms-table">
                <thead className="">
                    <tr className="rooms-table-header">
                        <th></th>
                        <th>Room Number</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="rooms-table-header">
                        <td>
                            <img src="https://t3.ftcdn.net/jpg/02/71/08/28/240_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg" alt="" />
                        </td>
                        <td>101</td>
                        <td>Single</td>
                        <td>$100</td>
                        <td>
                            <button className="book-room">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp4CULCWWaUzxMP5rGxTBVS2kwwKocDDsbXQ&s" alt="" />
                        </td>
                        <td>102</td>
                        <td>Double</td>
                        <td>$150</td>
                        <td>
                            <button className="book-room">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="https://www.choicehotels.com/hotelmedia/US/NC/charlotte/NC319/480/NC319SHNK77_1.webp" alt="" />
                        </td>
                        <td>103</td>
                        <td>Suite</td>
                        <td>$200</td>
                        <td>
                            <button className="book-room">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>


        </div>

    )
}

export default Rooms