import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Importando componentes MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Para feedback de carregamento

function EditarEquipamento() {
  const { equipamentoId } = useParams();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true); // State para controlar o carregamento

  useEffect(() => {
    const fetchEquipamento = async () => {
      setLoading(true);
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        margin: '40px auto',
        padding: { xs: '16px', sm: '32px' },
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 700, color: '#1a237e', textAlign: 'center' }}>
        Editar Equipamento
      </Typography>
      <Box sx={{ width: '100%' }}>
        <TextField
          label="Nome do Equipamento"
          variant="outlined"
          fullWidth
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Marca"
          variant="outlined"
          fullWidth
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Modelo"
          variant="outlined"
          fullWidth
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: '8px', boxShadow: '0 2px 8px rgba(26,35,126,0.08)' }}>
            Salvar Alterações
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EditarEquipamento;