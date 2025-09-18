import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Páginas
import DashboardPage from './pages/Dashboard.jsx';
import EquipamentosPage from './pages/Equipamentos.jsx';
import NovoEquipamento from './pages/NovoEquipamento.jsx';
import EditarEquipamento from './pages/EditarEquipamento.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import NovoCliente from './pages/NovoCliente.jsx';
import EditarCliente from './pages/EditarCliente.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      // Rotas de Equipamentos
      { path: "equipamentos", element: <EquipamentosPage /> },
      { path: "equipamentos/novo", element: <NovoEquipamento /> },
      { path: "equipamentos/:equipamentoId/editar", element: <EditarEquipamento /> },
      // Rotas de Clientes
      { path: "clientes", element: <ClientesPage /> },
      { path: "clientes/novo", element: <NovoCliente /> },
      { path: "clientes/:clienteId/editar", element: <EditarCliente /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);