import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

function EditarEquipamento() {
  const { equipamentoId } = useParams();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipamento = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/equipamentos/${equipamentoId}/`);
        const equipamento = response.data;
        setNome(equipamento.nome);
        setMarca(equipamento.marca);
        setModelo(equipamento.modelo);
        setQuantidade(equipamento.quantidade_total);
      } catch (error) {
        console.error("Erro ao buscar equipamento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipamento();
  }, [equipamentoId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const equipamentoAtualizado = { nome, marca, modelo, quantidade_total: quantidade };
    try {
      await axios.put(`http://127.0.0.1:8000/api/equipamentos/${equipamentoId}/`, equipamentoAtualizado);
      navigate('/equipamentos');
    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px', margin: 'auto', padding: 4, mt: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Editar Equipamento
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
          Salvar Alterações
        </Button>
      </Box>
    </Paper>
  );
}

export default EditarEquipamento;