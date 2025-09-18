import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ClienteCard from '../components/ClienteCard/ClienteCard';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/clientes/');
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const handleClienteDelete = (idClienteApagado) => {
    setClientes(clientes.filter(cliente => cliente.id !== idClienteApagado));
  };

  return (
    <div>
      <div className="header-lista">
        <h2>Lista de Clientes</h2>
        <Link to="/clientes/novo" className="btn-adicionar">Adicionar Novo</Link>
      </div>
      <div className="lista-cards">
        {clientes.map(cliente => (
          <ClienteCard 
            key={cliente.id} 
            cliente={cliente}
            onDelete={handleClienteDelete} 
          />
        ))}
      </div>
    </div>
  );
}

export default ClientesPage;