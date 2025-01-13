import {useEffect, useState} from 'react'
import {postman} from '../../postman.ts'
import {Alert, Box, Snackbar, Stack, Typography} from '@mui/material'
import Booking from '../../components/reservation/Booking.ts'
import ReservationCard from '../../components/reservation/ReservationCard.tsx'
import {OverridableStringUnion} from '@mui/types'
import {AlertColor, AlertPropsColorOverrides} from '@mui/material/Alert/Alert'

export default function ManageReservations() {
    const [bookings, setBookings] = useState<Array<Booking>>([])
    const [error, setError] = useState<boolean>(false)
    const [snackbar, setSnackbar] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>('success')

    const getBookings = () => {
        postman.get('/bookings')
            .then((res) => setBookings(res.data))
            .catch((error) => {
                console.log(error)
                setError(true)
            })
    }

    const showMessage = (msg: string, severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>) => {
        setSnackbar(msg)
        setSnackbarSeverity(severity)
    }

    useEffect(() => {
        getBookings()
    }, [])

    const errorView = <Stack sx={{mt: 2}}>
        <Alert sx={{width: '25vw', mx: 'auto'}} variant='filled' severity='error'>Unable to load reservations.</Alert>
    </Stack>

    return error ? errorView : (
        <Box sx={{p: 5}}>
            <Typography variant='h4'>Reservations</Typography>
            {bookings.length === 0 ? <Typography sx={{mt: 2}}>No reservations available to show.</Typography> :
            <Stack gap={2} sx={{mt: 2}}>
                {bookings.map((booking) => <ReservationCard key={booking.id} {...booking} onRefresh={getBookings} showMessage={showMessage} />)}
            </Stack>}
            <Snackbar open={Boolean(snackbar)} autoHideDuration={6000} onClose={() => setSnackbar('')}>
                <Alert severity={snackbarSeverity}>{snackbar}</Alert>
            </Snackbar>
        </Box>
    )
}
