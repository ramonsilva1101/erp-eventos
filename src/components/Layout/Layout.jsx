import React from 'react';
import Header from '../Header/Header';
import Box from '@mui/material/Box';

// Este componente foi simplificado e seu conteúdo movido para o App.jsx
// para seguir o padrão do React Router.
// Você pode apagar este arquivo ou mantê-lo vazio se preferir.
// O App.jsx agora é o nosso principal componente de Layout.
function Layout({ children }) {
    return (
        <Box>
            <Header />
            <main>{children}</main>
        </Box>
    );
}

export default Layout;