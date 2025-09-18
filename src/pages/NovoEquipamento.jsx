import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NovoEquipamento() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const novoEquipamento = { nome, marca, modelo, quantidade_total: quantidade };
    try {
      // GARANTINDO A BARRA FINAL AQUI
      await axios.post('http://127.0.0.1:8000/api/equipamentos/', novoEquipamento);
      navigate('/equipamentos');
    } catch (error) {
      console.error("Erro ao criar equipamento:", error);
    }
  };

  return (
    <div>
      <h2>Cadastrar Novo Equipamento</h2>
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
        <button type="submit" className="form-button">Salvar</button>
      </form>
    </div>
  );
}

export default NovoEquipamento;