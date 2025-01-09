import IRoom from './IRoom.tsx'
import {Box, Button, Stack, Typography} from '@mui/material'

interface ComponentProps {
    onSelected: () => void
}

type Props = ComponentProps & IRoom

export default function Room(props: Props) {
    return <Box sx={{border: '1px solid black', borderRadius: 5, p: 2, '&:hover': {backgroundColor: '#F0F8FF'}}}>
        <Stack direction='row'>
            <Box>
                <Typography variant='h5'>{props.roomType}</Typography>
                <Typography variant='subtitle1'>Room #{props.roomNumber}</Typography>
                <Typography variant='subtitle1'>Price: ${props.pricePerNight} / night</Typography>
            </Box>
            <Button variant='contained' sx={{ml: 'auto'}} onClick={props.onSelected}>Select</Button>
        </Stack>
    </Box>
}
