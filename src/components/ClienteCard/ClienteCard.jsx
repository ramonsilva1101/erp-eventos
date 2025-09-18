import { Link } from 'react-router-dom';
import axios from 'axios';
import './ClienteCard.css'; 

function ClienteCard({ cliente, onDelete }) {
  const handleDelete = async () => {
    const confirmar = window.confirm(`Tem certeza que deseja apagar o cliente "${cliente.nome}"?`);
    if (confirmar) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/clientes/${cliente.id}/`);
        onDelete(cliente.id);
      } catch (error) {
        console.error("Erro ao apagar cliente:", error);
        alert("Não foi possível apagar o cliente.");
      }
    }
  };

  return (
    // Adicionamos as classes 'card' e 'cliente-card'
    <div className="card cliente-card"> 
      <h3>{cliente.nome}</h3>
      <p><strong>E-mail:</strong> {cliente.email || 'N/A'}</p>
      <p><strong>Telefone:</strong> {cliente.telefone || 'N/A'}</p>
      <div className="card-footer">
        {/* O rodapé do card está vazio por enquanto, mas os botões ficarão aqui */}
        <div className="card-actions">
          <Link to={`/clientes/${cliente.id}/editar`} className="btn-editar">Editar</Link>
          <button onClick={handleDelete} className="btn-apagar">Apagar</button>
        </div>
      </div>
    </div>
  );
}

export default ClienteCard;