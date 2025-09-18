import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NovoCliente() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const novoCliente = { nome, telefone, email, endereco };
    try {
      await axios.post('http://127.0.0.1:8000/api/clientes/', novoCliente);
      navigate('/clientes');
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  return (
    <div>
      <h2>Cadastrar Novo Cliente</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>
        <div className="form-group">
          <label>E-mail:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Endereço:</label>
          <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        </div>
        <button type="submit" className="form-button">Salvar</button>
      </form>
    </div>
  );
}

export default NovoCliente; 