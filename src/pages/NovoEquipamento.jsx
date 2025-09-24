import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

function NovoEquipamento() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const novoEquipamento = {
      nome: nome,
      marca: marca,
      modelo: modelo,
      quantidade_total: quantidade,
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/equipamentos/', novoEquipamento);
      navigate('/equipamentos');
    } catch (error) {
      console.error("Erro ao criar equipamento:", error);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px', margin: 'auto', padding: 4, mt: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Cadastrar Novo Equipamento
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Nome do Equipamento"
          variant="outlined"
          fullWidth
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="Marca"
          variant="outlined"
          fullWidth
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <TextField
          label="Modelo"
          variant="outlined"
          fullWidth
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
        />
        <TextField
          label="Quantidade Total"
          variant="outlined"
          type="number"
          fullWidth
          required
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
        />
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          Salvar
        </Button>
      </Box>
    </Paper>
  );
}

export default NovoEquipamento;