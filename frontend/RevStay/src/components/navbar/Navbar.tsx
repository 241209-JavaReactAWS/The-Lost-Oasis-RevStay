import {AppBar, Badge, Box, IconButton, Toolbar, Typography} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu'
import {useNavigate} from 'react-router'
import {useEffect, useState} from 'react'
import {postman} from '../../postman.ts'
import { Link } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate()
    const [notificationsCount, setNotificationsCount] = useState<number>(0)

    useEffect(() => {
        const interval = setInterval(() => {
            postman.get('/notifications')
                .then((res) => {
                    if (res.data) setNotificationsCount(res.data.length)
                }).catch(() => setNotificationsCount(0))
        }, 30000)

        return () => {
            clearInterval(interval)
        }
    }, [])

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
                        <nav>
                            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                                <li style={{ marginRight: '20px' }}>
                                    <Link to="/search" style={{ textDecoration: 'none', color: 'inherit' }}>Hotel Search</Link>
                                </li>
                                <li>
                                    <Link to="/filter" style={{ textDecoration: 'none', color: 'inherit' }}>Hotel Filter</Link>
                                </li>
                            </ul>
                        </nav>
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
