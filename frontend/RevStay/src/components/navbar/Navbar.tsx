import {AppBar, Badge, Box, IconButton, Toolbar, Typography} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu'

export default function Navbar() {
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
                    Lost Oasis
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                    <IconButton size="large" color="inherit">
                        <Badge invisible badgeContent={0} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    </Box>
}
