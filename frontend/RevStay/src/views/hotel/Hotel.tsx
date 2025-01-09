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
    const { id } = useParams()
    const [imageIndex, setImageIndex] = useState(0)
    const [selectedRoom, setSelectedRoom] = useState<null | IRoom>(null)

    const hotel: Hotel = {
        id: 1,
        name: "Buena Vista Hotel",
        address: '123 Main St',
        city: 'Jarabacoa',
        state: 'La Vega',
        description: 'Buena Vista Hotel is a charming retreat nestled in the lush mountains of Jarabacoa, Dominican Republic. Surrounded by breathtaking views, this boutique hotel offers cozy accommodations, a serene ambiance, and personalized service. Guests can enjoy on-site amenities like an infinity pool, farm-to-table dining, and adventure packages for hiking, rafting, and exploring nearby waterfalls. Perfect for nature lovers and those seeking tranquility.',
        amenities: 'pool, dining, gym, lounge',
        rooms: [
            {
                id: 1,
                roomNumber: 123,
                roomType: 'Room, 1 King Bed',
                pricePerNight: 165.48
            },
            {
                id: 2,
                roomNumber: 124,
                roomType: 'Room, 2 Queen Beds',
                pricePerNight: 175.98
            },
            {
                id: 3,
                roomNumber: 125,
                roomType: 'Studio Suite, 1 King Bed',
                pricePerNight: 199.38
            }
        ],
        images: ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/ce/fa/12/hotel-cadiz-bahia.jpg?w=1400&h=-1&s=1', 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/10/09/1703/Grand-Hyatt-Doha-Hotel-and-Villas-P381-Exterior-Facade.jpg/Grand-Hyatt-Doha-Hotel-and-Villas-P381-Exterior-Facade.16x9.adapt.1920.1080.jpg'],
        rating: 4.2
    }

    const cycleImages = (direction: number) => {
        if (direction > 0) {
            if (imageIndex + 1 > (hotel.images.length - 1)) setImageIndex(0)
            else setImageIndex(imageIndex + 1)
        } else if (direction < 0) {
            if (imageIndex - 1 < 0) setImageIndex(hotel.images.length - 1);
            else setImageIndex(imageIndex - 1)
        }
    }

    return <Box sx={{my: 2, display: 'flex', flexDirection: 'column'}}>
        <Stack sx={{mx: 'auto', width: '75rem'}} gap={1}>
            <Paper elevation={1}>
                <Box sx={{p: 5, display: 'flex', alignItems: 'center', height: 300}}>
                    <Box>
                        <IconButton onClick={() => cycleImages(-1)}>
                            <NavigateBeforeIcon />
                        </IconButton>
                    </Box>
                    <img style={{margin: '0 auto'}} width={600} src={hotel.images.length === 0 ? hotelPlaceholderImage : hotel.images[imageIndex]} alt='Hotel Image' />
                    <Box>
                        <IconButton onClick={() => cycleImages(-1)}>
                            <NavigateNextIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
            <Stack sx={{mt: 2}} direction='row' alignItems='center' gap={3}>
                <Typography variant='h4'>{hotel.name}</Typography>
                <Stack direction='row' sx={{backgroundColor: '#1976d2', p: 1, borderRadius: 10, color: 'white'}}>
                    <Typography variant='subtitle1'>{hotel.rating}</Typography>
                    <StarIcon />
                </Stack>
            </Stack>
            <Typography variant='overline'>{`${hotel.address}, ${hotel.city}, ${hotel.state}`}</Typography>
            <Typography sx={{mt: 1}} variant='h5'>About this property</Typography>
            <Typography variant='subtitle1'>{hotel.description}</Typography>
            <Grid container spacing={2}>
                <Grid size={1}>
                    <Typography variant='h6'>Amenities</Typography>
                </Grid>
                <Grid size={11}>
                    <Stack direction='row' gap={2}>
                        {hotel.amenities.split(',').map((amenity, index) => <Chip key={index} color='primary' label={amenity} />)}
                    </Stack>
                </Grid>
            </Grid>
            <Typography sx={{mt: 3}} variant='h4'>Rooms</Typography>
            {hotel.rooms.map((room) => <Room key={room.id} {...room} onSelected={() => setSelectedRoom(room)} />)}
            {selectedRoom && <BookingForm hotelId={id} room={selectedRoom} />}
        </Stack>
    </Box>
}
