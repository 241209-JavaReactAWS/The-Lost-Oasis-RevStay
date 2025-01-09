import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="contained"
      color="primary"
      fullWidth
      sx={{ padding: '10px', fontWeight: 'bold' }}
      onClick={() => navigate('/login')} 
    >
      <Typography color="common.white">Login</Typography>
    </Button>
  )
}

export default LoginButton
