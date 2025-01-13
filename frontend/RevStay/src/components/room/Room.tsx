import IRoom from './IRoom.tsx'
import {Box, Button, Stack, Typography} from '@mui/material'

interface ComponentProps {
    onSelected: () => void,
    numDays: number | undefined,
    reserveButtonDisabled: boolean,
}

type Props = ComponentProps & IRoom

export default function Room(props: Props) {
    return <Box sx={{border: '1px solid black', borderRadius: 5, p: 2, '&:hover': {backgroundColor: '#F0F8FF'}, height: '90px'}}>
        <Stack direction='row' sx={{height: 1}}>
            <Box>
                <Typography variant='h5'>{props.roomType}</Typography>
                <Typography variant='subtitle1'>Room #{props.roomNumber}</Typography>
                <Typography variant='subtitle1'>Price: ${props.pricePerNight} / night</Typography>
            </Box>
            <Stack sx={{ml: 'auto'}} direction='row' gap={5} alignItems='center'>
                {props.numDays &&
                <Box>
                    <Typography><strong>Total</strong></Typography>
                    <Typography>${(props.numDays * props.pricePerNight).toFixed(2)}</Typography>
                </Box>}
                <Button sx={{height: 1}} disabled={props.reserveButtonDisabled} variant='contained' onClick={props.onSelected}>Reserve</Button>
            </Stack>
        </Stack>
    </Box>
}
