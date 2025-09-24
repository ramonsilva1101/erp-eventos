import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#282c34' }}>
      <Toolbar>
        <EventAvailableIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ERP Palco Locação
        </Typography>
        <Button component={Link} to="/" sx={{ color: 'white' }}>Dashboard</Button>
        <Button component={Link} to="/equipamentos" sx={{ color: 'white' }}>Equipamentos</Button>
        <Button component={Link} to="/clientes" sx={{ color: 'white' }}>Clientes</Button>
        <Button component={Link} to="/locacoes" sx={{ color: 'white' }}>Locações</Button>
        {/* Adicionaremos o link para Pagamentos em uma próxima fase */}
      </Toolbar>
    </AppBar>
  );
}
export default Header;