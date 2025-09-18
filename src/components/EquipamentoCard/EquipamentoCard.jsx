import { Link } from 'react-router-dom';
import axios from 'axios';
import './EquipamentoCard.css';

function EquipamentoCard({ equipamento, onDelete }) {
  const handleDelete = async () => {
    const confirmar = window.confirm(`Tem certeza que deseja apagar o equipamento "${equipamento.nome}"?`);
    if (confirmar) {
      try {
        // GARANTINDO A BARRA FINAL AQUI
        await axios.delete(`http://127.0.0.1:8000/api/equipamentos/${equipamento.id}/`);
        onDelete(equipamento.id);
      } catch (error) {
        console.error("Erro ao apagar equipamento:", error);
        alert("Não foi possível apagar o equipamento.");
      }
    }
  };

  return (
    <div className="card">
      <h3>{equipamento.nome}</h3>
      <p><strong>Marca:</strong> {equipamento.marca || 'N/A'}</p>
      <p><strong>Modelo:</strong> {equipamento.modelo || 'N/A'}</p>
      <div className="card-footer">
        <p className="quantidade">Qtd. Total: {equipamento.quantidade_total}</p>
        <div className="card-actions">
          <Link to={`/equipamentos/${equipamento.id}/editar`} className="btn-editar">Editar</Link>
          <button onClick={handleDelete} className="btn-apagar">Apagar</button>
        </div>
      </div>
    </div>
  );
}

export default EquipamentoCard;