import React, { useState } from 'react';
import HotelInfo from '../../components/admin-hotel/HotelInfo';
import AddHotelModal from '../../components/admin-hotel/AddHotelModal';

interface HotelData {
    id: string;
    name: string;
    address: string;
    rating: number;
    description: string;
    image?: string;
}

const HotelList: React.FC = () => {
    const [hotels, setHotels] = useState<HotelData[]>([
        {
            id: "1",
            name: "Sunset Beach Resort",
            address: "123 Ocean Drive, Beachville, FL 12345",
            rating: 4.5,
            description: "A luxurious beachfront resort with stunning ocean views and world-class amenities.",
            image: "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
        },
        {
            id: "2",
            name: "Mountain View Lodge",
            address: "456 Pine Road, Hilltown, CO 67890",
            rating: 4.2,
            description: "Cozy mountain retreat offering scenic hiking trails and ski-in/ski-out access.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeuffyYgvL-bm9vzoRrxKEfkHeuVssPK_w_A&s"
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdateHotel = (updatedHotel: HotelData) => {
        setHotels(prevHotels =>
            prevHotels.map(hotel =>
                hotel.id === updatedHotel.id ? updatedHotel : hotel
            )
        );

    };

    const handleDeleteHotel = (hotelId: string) => {
        setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));

    };

    const handleAddHotel = (newHotel: Omit<HotelData, 'id'>) => {
        const hotelWithId = {
            ...newHotel,
            id: Date.now().toString(), // Generate a simple unique ID
        };
        setHotels(prevHotels => [...prevHotels, hotelWithId]);
    };

    return (
        <div className="hotel-list">
            <button onClick={() => setIsModalOpen(true)}>Add New Hotel</button>

            {hotels.map(hotel => (
                <HotelInfo
                    key={hotel.id}
                    hotel={hotel}
                    onUpdate={handleUpdateHotel}
                    onDelete={handleDeleteHotel}
                />
            ))}

            <AddHotelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddHotel={handleAddHotel}
            />

        </div>
    );
};

export default HotelList;