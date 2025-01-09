import LoginForm from '../../components/login/LoginForm';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    width: '400px',
                    padding: '20px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    textAlign="center"
                    sx={{ color: '#1976d2', fontWeight: 'bold' }}
                >
                    Login
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'center',
                        marginBottom: '16px',
                        fontSize: '14px',
                        color: '#757575',
                    }}
                >
                    New user?{' '}
                    <Link
                        component="button"
                        underline="hover"
                        sx={{ color: '#1976d2', fontWeight: 'bold' }}
                        onClick={() => navigate('/register')} // Navigate to the register page
                    >
                        Click here
                    </Link>
                    {' '}to register.
                </Typography>
                <LoginForm />
            </Box>
        </Box>
    );
};

export default LoginPage;
