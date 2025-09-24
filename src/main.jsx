import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx';
import './index.css';
import DashboardPage from './pages/Dashboard.jsx';
import EquipamentosPage from './pages/EquipamentosPage.jsx';
import NovoEquipamento from './pages/NovoEquipamento.jsx';
import EditarEquipamento from './pages/EditarEquipamento.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import NovoCliente from './pages/NovoCliente.jsx';
import EditarCliente from './pages/EditarCliente.jsx';
import LocacoesPage from './pages/LocacoesPage.jsx';
import NovaLocacao from './pages/NovaLocacao.jsx';
import EditarLocacao from './pages/EditarLocacao.jsx';

const theme = createTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "equipamentos", element: <EquipamentosPage /> },
      { path: "equipamentos/novo", element: <NovoEquipamento /> },
      { path: "equipamentos/:equipamentoId/editar", element: <EditarEquipamento /> },
      { path: "clientes", element: <ClientesPage /> },
      { path: "clientes/novo", element: <NovoCliente /> },
      { path: "clientes/:clienteId/editar", element: <EditarCliente /> },
      { path: "locacoes", element: <LocacoesPage /> },
      { path: "locacoes/novo", element: <NovaLocacao /> },
      { path: "locacoes/:locacaoId/editar", element: <EditarLocacao /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);