import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditarCliente() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/clientes/${clienteId}/`);
        const cliente = response.data;
        setNome(cliente.nome);
        setTelefone(cliente.telefone);
        setEmail(cliente.email);
        setEndereco(cliente.endereco);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };
    fetchCliente();
  }, [clienteId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const clienteAtualizado = { nome, telefone, email, endereco };
    try {
      await axios.put(`http://127.0.0.1:8000/api/clientes/${clienteId}/`, clienteAtualizado);
      navigate('/clientes');
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  return (
    <div>
      <h2>Editar Cliente</h2>
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
        <button type="submit" className="form-button">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarCliente;