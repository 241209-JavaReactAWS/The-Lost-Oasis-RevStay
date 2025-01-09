import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Call the logout handler passed as a prop
        navigate('/login'); // Redirect to the login page
    };

    return (
        <Button
            type="button"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ padding: '10px', fontWeight: 'bold' }}
            onClick={handleLogout}
        >
            <Typography color="common.white">Logout</Typography>
        </Button>
    );
};

export default LogoutButton;
