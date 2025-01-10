import {useState} from 'react'
import {Box, MenuItem, Select, Stack, Typography} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers'
import IRoom from '../room/IRoom.tsx'
import {Dayjs} from 'dayjs'
import {postman} from '../../postman.ts'
import { useNavigate } from 'react-router';
import Room from '../room/Room.tsx'
import IHotel from '../../views/hotel/IHotel.ts'

interface Props {
    hotel: IHotel
}

export default function BookingForm(props: Props) {
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
    const [numGuests, setNumGuests] = useState<number>(1)
    const navigate = useNavigate();

    const days = checkOutDate?.diff(checkInDate, 'days')

    const reserve = (room: IRoom) => {

        if (checkInDate === null || checkOutDate === null) {
            console.error('Check-in or Check-out date is null');
            return;
        }

         postman
            .post('/bookings', {
                hotelID: props.hotel.id,
                roomID: room.id,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                numGuests: numGuests,
             })
             .then((res) => {
                console.log(res);
                navigate('/payment', {
                    state: {
                        hotelId: props.hotel.id,
                            hotelName: props.hotel.name, // Pass the hotel name
                            room: room,
                            userId: 1,
                            totalAmount: days ? days * room.pricePerNight : 0.00, // Calculate total price
                    }
                });
            })
            .catch((err) => {
                 console.log(err);
             });
    };

    const reserveButtonDisabled = checkInDate === null || checkOutDate === null
        || checkInDate.isSame(checkOutDate) || checkInDate.isAfter(checkOutDate)

    return <Box sx={{mt: 3}}>
        <Typography variant='h4'>Reservation</Typography>
        <Stack direction='row' gap={3} sx={{mt: 2}} alignItems='end'>
            <Box>
                <Typography>Check-in</Typography>
                <DatePicker value={checkInDate} onChange={(nv) => setCheckInDate(nv)} />
            </Box>
            <Box>
                <Typography>Check-out</Typography>
                <DatePicker value={checkOutDate} onChange={(nv) => setCheckOutDate(nv)} />
            </Box>
            <Box>
                <Typography>Guests</Typography>
                <Select label='Guests' value={numGuests} onChange={(e) => setNumGuests(e.target.value as number)}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                </Select>
            </Box>
        </Stack>
        <Stack gap={1}>
            <Typography sx={{mt: 3}} variant='h5'>Rooms</Typography>
            {props.hotel.rooms.map((room) => <Room key={room.id} numDays={days} reserveButtonDisabled={reserveButtonDisabled} {...room} onSelected={() => reserve(room)} />)}
        </Stack>
    </Box>
}
