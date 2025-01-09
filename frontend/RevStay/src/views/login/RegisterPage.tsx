import RegisterForm from '../../components/register/RegisterForm';
import { Box, Typography } from '@mui/material';

const RegisterPage = () => {
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
                    Register
                </Typography>
                <RegisterForm />
            </Box>
        </Box>
    );
};

export default RegisterPage;
