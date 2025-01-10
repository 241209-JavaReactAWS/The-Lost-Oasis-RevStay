import {AppBar, Badge, Box, IconButton, Toolbar, Typography} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu'
import {useNavigate} from 'react-router'
import {useEffect, useState} from 'react'
import {postman} from '../../postman.ts'
import LoginButton from '../login/LoginButton.tsx';
import LogoutButton from '../login/LogoutButton.tsx';
import {INotification} from '../notification/INotification.ts'

export default function Navbar() {
    const navigate = useNavigate()
    const [notificationsCount, setNotificationsCount] = useState<number>(0)
    const [isLogged, setIsLogged] = useState<boolean>(!!localStorage.getItem('token'))

    useEffect(() => {
        const interval = setInterval(() => {
            postman.get('/notifications')
                .then((res) => {
                    if (res.data) {
                        const notifications = res.data as Array<INotification>
                        setNotificationsCount(notifications.filter((n) => !n.read).length)
                    }
                }).catch(() => setNotificationsCount(0))
        }, 30000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLogged(false);
        navigate('/login');
    }


    return <Box sx={{flexGrow: 1}}>
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    RevStay
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    {
                        isLogged
                            ? <LogoutButton onLogout={handleLogout} />
                            : <LoginButton />
                    }
                </Box>
                <Box>
                    <IconButton size="large" color="inherit" onClick={() => navigate('/notifications')}>
                        <Badge invisible={notificationsCount === 0} badgeContent={notificationsCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    </Box>
}
