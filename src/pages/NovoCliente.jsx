import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Importando componentes MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
        Cadastrar Novo Cliente
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
        Salvar
      </Button>
    </Box>
  );
}

export default NovoCliente;