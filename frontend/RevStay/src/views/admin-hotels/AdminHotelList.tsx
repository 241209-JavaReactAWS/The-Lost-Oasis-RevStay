import React, { useState, useEffect } from 'react';
import HotelInfo from '../../components/admin-hotel/HotelInfo';
import AddHotelModal from '../../components/admin-hotel/AddHotelModal';
import { postman } from '../../postman';

// interface User {
//     userId: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     role: string;
// }

interface HotelData {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    amenities: string;
    // owner?: User;
    rooms: any[];
    images: string[];
    rating: number;
}

const HotelList: React.FC = () => {

    const [hotels, setHotels] = useState<HotelData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await postman.get('/api/v1/hotels/admin');
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);


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
        // const hotelWithId = {
        //     ...newHotel,
        //     id: Date.now().toString(), // Generate a simple unique ID
        // };
        // setHotels(prevHotels => [...prevHotels, hotelWithId]);
    };

    if (loading) return <div>Loading...</div>;

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
                onAddHotel={() => console.log('Add hotel')}
            />

        </div>
    );
};

export default HotelList;