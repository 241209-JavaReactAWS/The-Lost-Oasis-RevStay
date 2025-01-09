import {useState} from 'react'
import {Box, Button, MenuItem, Select, Stack, Typography} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers'
import IRoom from '../room/IRoom.tsx'
import {Dayjs} from 'dayjs'
import {postman} from '../../postman.ts'
import { useNavigate } from 'react-router';

interface Props {
    hotelId: string | undefined,
    hotel: {
        name: string;
        id: number;
    };
    room: IRoom,
}

export default function BookingForm(props: Props) {
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
    const [numGuests, setNumGuests] = useState<number>(1)
    const navigate = useNavigate();

    const reserve = () => {

        if (checkInDate === null || checkOutDate === null) {
            console.error('Check-in or Check-out date is null');
            return;
        }
        const totalAmount = checkOutDate.diff(checkInDate, 'days') * props.room.pricePerNight;

         postman
            .post('/bookings', {
                hotelID: props.hotelId,
                roomID: props.room.id,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                numGuests: numGuests,
             })
             .then((res) => {
                console.log(res);
                navigate('/payment', {
                    state: {
                        hotelId: props.hotelId,
                            hotelName: props.hotel.name, // Pass the hotel name
                            room: props.room,
                            userId: 1,
                            totalAmount: props.room.pricePerNight * checkOutDate.diff(checkInDate, 'days'), // Calculate total price
                    }
                });
            })
            .catch((err) => {
                 console.log(err);
             });
    };


    const reserveButtonDisabled = checkInDate === null || checkOutDate === null
        || checkInDate.isSame(checkOutDate) || checkInDate.isAfter(checkOutDate)

    return <Box sx={{my: 3}}>
        <Typography variant='h4'>Reservation</Typography>
        <Typography variant='h5' sx={{my: 2}}>{props.room.roomType}</Typography>
        <Stack direction='row' gap={3} sx={{my: 2}} alignItems='end'>
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
            <Box>
                <Typography>Total</Typography>
                <Box sx={{py: 2, px: 1, border: '1px solid #0000003F'}}>
                    <Typography>{(checkInDate && checkOutDate) ? `$${props.room.pricePerNight * checkOutDate.diff(checkInDate, 'days')}` : 'N/A'}</Typography>
                </Box>
            </Box>
            <Button disabled={reserveButtonDisabled} sx={{height: 60}} variant='contained' onClick={reserve}>Reserve</Button>
        </Stack>
    </Box>
}
