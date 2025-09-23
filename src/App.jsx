
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A237E', // azul escuro
      contrastText: '#fff',
    },
    secondary: {
      main: '#455A64', // cinza escuro
      contrastText: '#fff',
    },
    background: {
      default: '#F4F6F8', // cinza claro
      paper: '#fff',
    },
    text: {
      primary: '#222', // quase preto
      secondary: '#455A64', // cinza escuro
    },
    divider: '#B0BEC5', // cinza médio
    success: {
      main: '#43A047', // verde
      contrastText: '#fff',
    },
    error: {
      main: '#E53935', // vermelho
      contrastText: '#fff',
    },
    warning: {
      main: '#FFA000', // amarelo escuro
      contrastText: '#fff',
    },
    info: {
      main: '#1976D2', // azul padrão
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightBold: 700,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'none',
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: '#1A237E',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1976D2',
          },
        },
        containedSecondary: {
          backgroundColor: '#455A64',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1A237E',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: '#fff',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#1A237E',
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h5: {
          color: '#1A237E',
          fontWeight: 700,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh" sx={{ background: theme.palette.background.default }}>
        <Header />
        <Box component="main" sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;