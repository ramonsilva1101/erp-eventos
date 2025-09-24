import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function App() {
  return (
    <Box>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
export default App;