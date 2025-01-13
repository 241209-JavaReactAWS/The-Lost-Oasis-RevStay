import Booking from './Booking.ts'
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from '@mui/material'
import hotelPlaceholderImage from "../../assets/hotel-placeholder.png";
import dayjs from 'dayjs'
import {postman} from '../../postman.ts'
import {OverridableStringUnion} from '@mui/types'
import {AlertColor, AlertPropsColorOverrides} from '@mui/material/Alert/Alert'

interface P {
    onRefresh: () => void,
    showMessage: (msg: string, severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>) => void,
}

type Props = Booking & P

export default function ReservationCard(props: Props) {
    const cancelReservation = () => {
        postman.delete(`/bookings/${props.id}`)
            .then(() => {
                props.showMessage('Reservation canceled successfully!', 'success')
                props.onRefresh()
            }).catch(() => props.showMessage('Unable to cancel reservation.', 'error'))
    }

    const viewInvoice = () => {
        postman.get(`/bookings/invoice/${props.id}`, {
            responseType: 'blob'
        }).then((res) => {
            const _url = window.URL.createObjectURL(res.data)
            window.open(_url, "_blank")
        }).catch((err) => {
            console.log(err)
            props.showMessage('Unable to generate invoice.', 'error')
        })
    }

    return <Card sx={{maxWidth: 345}}>
        <CardMedia sx={{height: 140}} image={(props.hotel.images && props.hotel.images.length !== 0) ? props.hotel.images[0] : hotelPlaceholderImage} title={props.hotel.name}/>
        <CardContent>
            <Typography variant='h5'>{props.hotel.name}</Typography>
            <Typography variant='subtitle1'><strong>Room type:</strong> {props.room.roomType}</Typography>
            <Typography variant='subtitle1'><strong>Check in:</strong> {dayjs(props.checkIn, 'YYYY-MM-DD').format('MM/DD/YYYY')}</Typography>
            <Typography variant='subtitle1'><strong>Check out:</strong> {dayjs(props.checkOut, 'YYYY-MM-DD').format('MM/DD/YYYY')}</Typography>
            <Typography variant='subtitle1'><strong>Guests:</strong> {props.numGuests}</Typography>
            <Typography variant='subtitle1'><strong>Status:</strong> {props.status}</Typography>
        </CardContent>
        <CardActions>
            <Button size='small' variant='outlined' onClick={viewInvoice}>View Invoice</Button>
            {props.status !== 'USER_CANCELED' && props.status !== 'OWNER_CANCELED' && <Button size='small' variant='outlined' onClick={cancelReservation}>Cancel Reservation</Button>}
        </CardActions>
    </Card>
}
