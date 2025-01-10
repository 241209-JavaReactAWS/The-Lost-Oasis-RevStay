import {Alert, Box, Chip, IconButton, Paper, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Grid2';
import hotelPlaceholderImage from "../../assets/hotel-placeholder.png";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from 'react'
import BookingForm from '../../components/booking-form/BookingForm.tsx';
import { useParams } from 'react-router';
import IHotel from './IHotel.ts'
import {postman} from '../../postman.ts'

export default function Hotel() {
    const { id } = useParams()
    const [hotel, setHotel] = useState<IHotel | null>(null)
    const [imageIndex, setImageIndex] = useState(0)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        postman.get(`/api/v1/hotels/${id}`)
            .then((res) => setHotel(res.data))
            .catch(() => setError(true))
    }, [id])

    const cycleImages = (direction: number) => {
        if (direction > 0) {
            setImageIndex((prevIndex) => (prevIndex + 1 > hotel.images.length - 1 ? 0 : prevIndex + 1));
        } else if (direction < 0) {
            setImageIndex((prevIndex) => (prevIndex - 1 < 0 ? hotel.images.length - 1 : prevIndex - 1));
        }
    };

    const errorView = <Stack sx={{mt: 2}}>
            <Alert sx={{width: '25vw', mx: 'auto'}} variant='filled' severity='error'>Unable to load hotel details.</Alert>
        </Stack>

    return error ? errorView : hotel && <Box sx={{my: 2, display: 'flex', flexDirection: 'column'}}>
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
            <BookingForm hotel={hotel} />
        </Stack>
    </Box>
}
