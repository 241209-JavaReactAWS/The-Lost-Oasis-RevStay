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
    id: number;
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
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteHotel = async (hotelId: number) => {
        if (!window.confirm('Are you sure you want to delete this hotel?')) {
            return;
        }

        try {
            setDeleteLoading(hotelId);
            setDeleteError(null);

            await postman.delete(`/api/v1/hotels/${hotelId}`);

            // Remove hotel from state
            setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));

        } catch (err) {
            setDeleteError('Failed to delete hotel');
            console.error('Error deleting hotel:', err);
        } finally {
            setDeleteLoading(null);
        }
    };

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await postman.get<HotelData[]>('/api/v1/hotels/admin');
            setHotels(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch hotels');
            console.error('Error fetching hotels:', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHotels();
    }, []);

    const handleSuccess = () => {
        fetchHotels(); // Refresh the hotel list
    };


    const handleUpdateHotel = (updatedHotel: HotelData) => {
        setHotels(prevHotels =>
            prevHotels.map(hotel =>
                hotel.id === updatedHotel.id ? updatedHotel : hotel
            )
        );

    };

    // const handleDeleteHotel = (hotelId: string) => {
    //     setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));

    // };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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

            {hotels.length === 0 && (
                <div>
                    <p>No hotels found. Add your first hotel!</p>
                </div>
            )}

            <AddHotelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />

        </div>
    );
};

export default HotelList;