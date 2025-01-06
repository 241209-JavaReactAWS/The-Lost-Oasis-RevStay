import {INotification} from './INotification.ts'
import {Box, Button, Stack, TableCell, TableRow, Typography} from '@mui/material'

export default function Notification(props: INotification) {
    return <TableRow>
        <TableCell sx={{backgroundColor: props.read ? 'unset' : '#F2F3F4', '&:hover': {backgroundColor: '#FEFEFA'}}}>
            <Stack direction='row'>
                <Box>
                    <Typography variant='h5'>{props.subject}</Typography>
                    <Typography variant='h6'>{props.message}</Typography>
                    <Typography variant='overline'>{props.timestamp}</Typography>
                </Box>
                <Button sx={{ml: 'auto'}}>Mark as Read</Button>
            </Stack>
        </TableCell>
    </TableRow>
}
