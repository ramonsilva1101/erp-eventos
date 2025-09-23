
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Box from '@mui/material/Box';

function Header() {
  return (
    <AppBar position="static" elevation={4} sx={{
      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
      boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.15)'
    }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <EventAvailableIcon sx={{ mr: 1, fontSize: 32, color: 'white' }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: 1, color: 'white' }}>
            ERP Palco Locação
          </Typography>
        </Box>
        <Button component={Link} to="/" sx={{ color: 'white', fontWeight: 500, mx: 1 }}>Dashboard</Button>
        <Button component={Link} to="/equipamentos" sx={{ color: 'white', fontWeight: 500, mx: 1 }}>Equipamentos</Button>
        <Button component={Link} to="/clientes" sx={{ color: 'white', fontWeight: 500, mx: 1 }}>Clientes</Button>
        <Button component={Link} to="/locacoes" sx={{ color: 'white', fontWeight: 500, mx: 1 }}>Locações</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;