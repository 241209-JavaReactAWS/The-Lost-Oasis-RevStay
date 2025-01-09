import {Box, Chip, IconButton, Paper, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Grid2'
import hotelPlaceholderImage from "../../assets/hotel-placeholder.png"
import IRoom from '../../components/room/IRoom.tsx'
import Room from '../../components/room/Room.tsx'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import StarIcon from '@mui/icons-material/Star';
import {useState} from 'react'
import BookingForm from '../../components/booking-form/BookingForm.tsx'
import {useParams} from 'react-router'
import { useNavigate } from 'react-router-dom';
interface Hotel {
    id: number,
    name: string,
    address: string,
    city: string,
    state: string,
    description: string,
    amenities: string,
    rooms: Array<IRoom>,
    images: Array<string>,
    rating: number,
}

export default function Hotel() {
    const { id } = useParams();
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState<null | IRoom>(null);
    const navigate = useNavigate(); // Initialize navigate

    const hotel: Hotel = {
        id: 1,
        name: "Buena Vista Hotel",
        address: '123 Main St',
        city: 'Jarabacoa',
        state: 'La Vega',
        description: 'Buena Vista Hotel is a charming retreat nestled in the lush mountains of Jarabacoa, Dominican Republic...',
        amenities: 'pool, dining, gym, lounge',
        rooms: [
            { id: 1, roomNumber: 123, roomType: 'Room, 1 King Bed', pricePerNight: 165.48 },
            { id: 2, roomNumber: 124, roomType: 'Room, 2 Queen Beds', pricePerNight: 175.98 },
            { id: 3, roomNumber: 125, roomType: 'Studio Suite, 1 King Bed', pricePerNight: 199.38 },
        ],
        images: [
            'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/ce/fa/12/hotel-cadiz-bahia.jpg?w=1400&h=-1&s=1',
            'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/10/09/1703/Grand-Hyatt-Doha-Hotel-and-Villas-P381-Exterior-Facade.jpg',
        ],
        rating: 4.2,
    };

    const handleRoomSelection = (room: IRoom) => {
        // Navigate to Payments.tsx with query parameters for the hotel ID and room details
        const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the user JSON or fallback to an empty object
navigate(`/payment`, {
    state: { hotelId: id, room, userId: user.id },
});
    };

    return (
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column' }}>
            <Stack sx={{ mx: 'auto', width: '75rem' }} gap={1}>
                {/* ...Hotel UI code */}
                <Typography sx={{ mt: 3 }} variant="h4">
                    Rooms
                </Typography>
                {hotel.rooms.map((room) => (
                    <Room key={room.id} {...room} onSelected={() => handleRoomSelection(room)} />
                ))}
            </Stack>
        </Box>
    );
}