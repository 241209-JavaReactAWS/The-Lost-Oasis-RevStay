import {INotification} from './INotification.ts'
import {Box, Button, Stack, TableCell, TableRow, Typography} from '@mui/material'

interface P {
    markRead: (id: number) => void,
}

type Props = INotification & P

export default function Notification(props: Props) {
    return <TableRow>
        <TableCell sx={{backgroundColor: props.read ? 'unset' : '#F2F3F4', '&:hover': {backgroundColor: '#FEFEFA'}}}>
            <Stack direction='row'>
                <Box>
                    <Typography variant='h5'>{props.subject}</Typography>
                    <Typography variant='h6'>{props.message}</Typography>
                    <Typography variant='overline'>{props.timestamp}</Typography>
                </Box>
                <Button sx={{ml: 'auto'}} onClick={() => props.markRead(props.id)}>Mark as Read</Button>
            </Stack>
        </TableCell>
    </TableRow>
}
