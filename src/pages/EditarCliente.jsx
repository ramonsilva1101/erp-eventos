import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importando componentes MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

function EditarCliente() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/clientes/${clienteId}/`);
        const cliente = response.data;
        setNome(cliente.nome);
        setTelefone(cliente.telefone);
        setEmail(cliente.email);
        setEndereco(cliente.endereco);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: '500px',
        margin: '40px auto',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Editar Cliente
      </Typography>

      <TextField
        label="Nome do Cliente"
        variant="outlined"
        fullWidth
        required
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <TextField
        label="Telefone"
        variant="outlined"
        fullWidth
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />
      <TextField
        label="E-mail"
        variant="outlined"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Endereço"
        variant="outlined"
        fullWidth
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
      />
      
      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
        Salvar Alterações
      </Button>
    </Box>
  );
}

export default EditarCliente;