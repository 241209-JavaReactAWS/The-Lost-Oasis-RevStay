import IRoom from './IRoom.tsx'
import {Box, Button, Stack, Typography} from '@mui/material'

export default function Room(props: IRoom) {
    return <Box sx={{border: '1px solid black', borderRadius: 5, p: 2}}>
        <Stack direction='row'>
            <Box>
                <Typography variant='h5'>{props.roomType}</Typography>
                <Typography variant='subtitle1'>Room #{props.roomNumber}</Typography>
                <Typography variant='subtitle1'>Price: ${props.pricePerNight} / night</Typography>
            </Box>
            <Button variant='contained' sx={{ml: 'auto'}}>Reserve</Button>
        </Stack>
    </Box>
}
