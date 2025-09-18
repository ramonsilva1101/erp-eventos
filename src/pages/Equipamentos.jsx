import { useState, useEffect } from 'react';
import axios from 'axios';
// A correção está na linha abaixo:
import { Link } from 'react-router-dom'; 
import EquipamentoCard from '../components/EquipamentoCard/EquipamentoCard';

function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([]);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/equipamentos/');
        setEquipamentos(response.data);
      } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
      }
    };
    fetchEquipamentos();
  }, []);

  const handleEquipamentoDelete = (idDoEquipamentoApagado) => {
    const novaLista = equipamentos.filter(equip => equip.id !== idDoEquipamentoApagado);
    setEquipamentos(novaLista);
  };

  return (
    <div>
      <div className="header-lista">
        <h2>Lista de Equipamentos</h2>
        <Link to="/equipamentos/novo" className="btn-adicionar">Adicionar Novo</Link>
      </div>
      <div className="lista-cards">
        {equipamentos.map(equipamento => (
          <EquipamentoCard 
            key={equipamento.id} 
            equipamento={equipamento}
            onDelete={handleEquipamentoDelete} 
          />
        ))}
      </div>
    </div>
  );
}

export default EquipamentosPage;