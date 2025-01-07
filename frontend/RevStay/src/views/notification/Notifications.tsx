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
import {postman} from '../../postman.ts'

export default function Notifications() {
    const [notifications, setNotifications] = useState<Array<INotification>>([])
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        postman.get('/notifications')
            .then((res) => {
                setNotifications(res.data)
            }).catch(() => setError(true))
    }, [])

    const handleFilterToggle = (_event: MouseEvent<HTMLElement>, newFilter: 'all' | 'unread' | null) => {
        if (newFilter) setFilter(newFilter)
    }

    const markAsRead = async (id: number): Promise<void> => {
        setNotifications(notifications.map((n) => n.id === id ? {...n, read: true} : n))
        await postman.post(`/notifications/${id}`)
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
                    {(notifications && notifications.length > 0) ?
                        (filter === 'all' ?
                            notifications.map((notification) => <Notification key={notification.id} {...notification} markRead={markAsRead} />)
                            : notifications.filter((n) => !n.read).map((notification) => <Notification key={notification.id} {...notification} markRead={markAsRead} />)
                        ) : <TableRow>
                        <TableCell>
                            <Typography variant='h5'>{error ? "An error occurred fetching notifications." : "There are no notifications available."}</Typography>
                        </TableCell>
                    </TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}
