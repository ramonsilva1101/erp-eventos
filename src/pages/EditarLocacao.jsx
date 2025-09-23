import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import SelecaoEquipamentos from '../components/SelecaoEquipamentos/SelecaoEquipamentos';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

function EditarLocacao() {
  const { locacaoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cliente: '',
    status: '',
    data_locacao: '',
    data_devolucao: '',
    valor_total: '',
    itens: [],
  });
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [locacaoRes, clientesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/locacoes/${locacaoId}/`),
          axios.get('http://127.0.0.1:8000/api/clientes/')
        ]);
        const locacao = locacaoRes.data;
        setFormData({
          cliente: locacao.cliente,
          status: locacao.status,
          data_locacao: locacao.data_locacao,
          data_devolucao: locacao.data_devolucao,
          valor_total: locacao.valor_total,
          itens: locacao.itens || [],
        });
        setClientes(clientesRes.data);
      } catch (error) {
        alert('Erro ao buscar dados da locação ou clientes.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locacaoId]);

  const handleFormChange = (event) => {
    // ... (lógica de handleFormChange)
  };
  
  const handleItensChange = (novosItens) => {
    // ... (lógica de handleItensChange)
  };

  const handleSubmit = async (event) => {
    // ... (lógica de handleSubmit)
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, mx: 'auto', my: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, textAlign: 'center', color: 'primary.main', letterSpacing: 1 }}>
        Editar Locação
      </Typography>
      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel>Cliente</InputLabel>
        <Select name="cliente" value={formData.cliente} label="Cliente" onChange={handleFormChange}>
          <MenuItem value="" disabled>Selecione um cliente</MenuItem>
          {clientes.map(cliente => (
            <MenuItem key={cliente.id} value={cliente.id}>{cliente.nome}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField name="data_locacao" label="Data da Locação" type="date" value={formData.data_locacao} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required fullWidth sx={{ mb: 2 }} />
      <TextField name="data_devolucao" label="Data da Devolução" type="date" value={formData.data_devolucao} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required fullWidth sx={{ mb: 2 }} />
      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={formData.status} label="Status" onChange={handleFormChange}>
          <MenuItem value="ORC">Orçamento</MenuItem>
          <MenuItem value="CONF">Confirmada</MenuItem>
          <MenuItem value="FIN">Finalizada</MenuItem>
          <MenuItem value="CANC">Cancelada</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 'bold', color: '#555', mb: 1 }}>Equipamentos:</Typography>
        <SelecaoEquipamentos itensSelecionados={formData.itens} onSelecaoChange={handleItensChange} isEditMode={true} />
      </FormControl>
      <TextField name="valor_total" label="Valor Total" type="number" value={formData.valor_total} onChange={handleFormChange} InputProps={{ inputProps: { step: '0.01' } }} required fullWidth sx={{ mb: 2 }} />
      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1, width: '100%' }}>Salvar Alterações</Button>
    </Box>
  );
}
export default EditarLocacao;