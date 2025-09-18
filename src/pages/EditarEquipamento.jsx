import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditarEquipamento() {
  const { equipamentoId } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    const fetchEquipamento = async () => {
      try {
        // GARANTINDO A BARRA FINAL AQUI
        const response = await axios.get(`http://127.0.0.1:8000/api/equipamentos/${equipamentoId}/`);
        const equipamento = response.data;
        setNome(equipamento.nome);
        setMarca(equipamento.marca);
        setModelo(equipamento.modelo);
        setQuantidade(equipamento.quantidade_total);
      } catch (error) {
        console.error("Erro ao buscar equipamento:", error);
      }
    };
    fetchEquipamento();
  }, [equipamentoId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const equipamentoAtualizado = { nome, marca, modelo, quantidade_total: quantidade };
    try {
      // GARANTINDO A BARRA FINAL AQUI
      await axios.put(`http://127.0.0.1:8000/api/equipamentos/${equipamentoId}/`, equipamentoAtualizado);
      navigate('/equipamentos');
    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error);
    }
  };

  return (
    <div>
      <h2>Editar Equipamento</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Marca:</label>
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Modelo:</label>
          <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Quantidade Total:</label>
          <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} min="1" required />
        </div>
        <button type="submit" className="form-button">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarEquipamento;