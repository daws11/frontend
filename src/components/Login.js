import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';
import authService from '../services/authService';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/bg.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ open,setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both fields are required');
      setErrorOpen(true);
      return;
    }

    try {
      await authService.login(username, password);
      const user = authService.getDecodedToken();
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Invalid credentials');
      setErrorOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs" style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `url(${backgroundImage}) no-repeat center center`,
      backgroundSize: 'cover'
    }}>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography component="h1" variant="h5" align="center">
          <img src={logo} alt="Logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </Typography>
        <form onSubmit={handleLogin} style={{ marginTop: '10px' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Login
          </Button>
        </form>
      </Paper>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
