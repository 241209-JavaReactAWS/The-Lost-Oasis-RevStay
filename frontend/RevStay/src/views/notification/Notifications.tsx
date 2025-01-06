import {
    Box, Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material'
import {useEffect, useState, MouseEvent} from 'react'
import {INotification} from '../../components/notification/INotification.ts'
import Notification from '../../components/notification/Notification.tsx'

export default function Notifications() {
    const [notifications, setNotifications] = useState<Array<INotification>>([])
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        // todo replace this with API call
        const notifications: Array<INotification> = [
            {
                id: 1,
                subject: 'Booking Confirmed',
                message: 'Your booking at Buena Vista Hotel has been confirmed for 12/19.',
                read: false,
                timestamp: '2025-01-01 05:45:19'
            },
            {
                id: 2,
                subject: 'Booking Confirmed',
                message: 'Your booking at Buena Vista Hotel has been confirmed for 12/19.',
                read: false,
                timestamp: '2025-01-01 05:45:19'
            },
            {
                id: 3,
                subject: 'Booking Confirmed',
                message: 'Your booking at Buena Vista Hotel has been confirmed for 12/19.',
                read: false,
                timestamp: '2025-01-01 05:45:19'
            },
            {
                id: 4,
                subject: 'Booking Confirmed',
                message: 'Your booking at Buena Vista Hotel has been confirmed for 12/19.',
                read: true,
                timestamp: '2025-01-01 05:45:19'
            },
            {
                id: 5,
                subject: 'Booking Confirmed',
                message: 'Your booking at Buena Vista Hotel has been confirmed for 12/19.',
                read: true,
                timestamp: '2025-01-01 05:45:19'
            }
        ]

        setNotifications(notifications)
    }, [])

    const handleFilterToggle = (_event: MouseEvent<HTMLElement>, newFilter: 'all' | 'unread' | null) => {
        if (newFilter) setFilter(newFilter)
    }

    return <Box sx={{p: 5}}>
        <Typography variant='h4'>Notifications</Typography>
        <TableContainer component={Paper} sx={{mt: 2}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <ToggleButtonGroup value={filter} exclusive onChange={handleFilterToggle} >
                                <ToggleButton value='all'>All</ToggleButton>
                                <ToggleButton value='unread'>Unread</ToggleButton>
                            </ToggleButtonGroup>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notifications ? (filter === 'all' ? notifications.map((notification) => <Notification key={notification.id} {...notification} />) : notifications.filter((n) => !n.read).map((notification) => <Notification key={notification.id} {...notification} />)) : <></>}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}
