import {
    AppBar,
    Badge,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import {useNavigate} from 'react-router'
import {useEffect, useState} from 'react'
import {postman} from '../../postman.ts'
import LoginButton from '../login/LoginButton.tsx';
import LogoutButton from '../login/LogoutButton.tsx';
import {INotification} from '../notification/INotification.ts'
import {useAuth} from '../../hooks/useAuth.tsx'

export default function Navbar() {
    const navigate = useNavigate()
    const auth = useAuth()
    const [notificationsCount, setNotificationsCount] = useState<number>(0)
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    useEffect(() => {
        if (auth.isAuthenticated) {
            const pingForNotifications = () => {
                postman.get('/notifications')
                    .then((res) => {
                        if (res.data) {
                            const notifications = res.data as Array<INotification>
                            setNotificationsCount(notifications.filter((n) => !n.read).length)
                        }
                    }).catch(() => setNotificationsCount(0))
            }

            pingForNotifications()

            const interval = setInterval(() => pingForNotifications(), 30000)

            return () => {
                clearInterval(interval)
            }
        }
    }, [auth.isAuthenticated])

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        auth.setAuthenticated(false)
        auth.setRole('DEFAULT')
        navigate('/login');
    }

    const redirectToDashboard = () => {
        if (auth.role === 'OWNER') navigate('/owner-dashboard')
        else if (auth.role === 'CUSTOMER') navigate('/customer-dashboard')
        else navigate('/')
    }

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={redirectToDashboard}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary='Dashboard' />
                    </ListItemButton>
                </ListItem>
                {auth.role === 'OWNER' && <>
                    {/* Add Owner functions here */}
                </>}
                {auth.role === 'CUSTOMER' && <>
                    {/* Add Customer functions here */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/reservations')}>
                            <ListItemIcon>
                                <BookIcon />
                            </ListItemIcon>
                            <ListItemText primary='Reservations' />
                        </ListItemButton>
                    </ListItem>
                </>}
            </List>
        </Box>
    )

    return <Box sx={{flexGrow: 1}}>
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' }, '&:hover': { cursor: 'pointer' } }}
                    onClick={() => navigate('/')}
                >
                    RevStay
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    {
                        auth.isAuthenticated
                            ? <LogoutButton onLogout={handleLogout} />
                            : <LoginButton />
                    }
                </Box>
                {auth.isAuthenticated && <Box>
                    <IconButton size="large" color="inherit" onClick={() => navigate('/notifications')}>
                        <Badge invisible={notificationsCount === 0} badgeContent={notificationsCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Box>}
            </Toolbar>
        </AppBar>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {DrawerList}
        </Drawer>
    </Box>
}
