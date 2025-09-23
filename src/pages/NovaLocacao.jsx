import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import SelecaoEquipamentos from '../components/SelecaoEquipamentos/SelecaoEquipamentos';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';

function NovaLocacao() {
  const navigate = useNavigate();
  const hoje = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    cliente: '',
    data_locacao: hoje,
    data_devolucao: hoje,
    valor_total: '',
    status: 'ORC',
    itens: [],
  });
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/clientes/');
        setClientes(response.data);
      } catch (error) { console.error("Erro ao buscar clientes:", error); }
    };
    fetchClientes();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItensChange = (novosItens) => {
    setFormData(prev => ({ ...prev, itens: novosItens }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const locacaoFinal = { ...formData, itens: formData.itens.filter(item => item.quantidade > 0 && !isNaN(parseInt(item.quantidade))) };
    if (locacaoFinal.itens.length === 0) {
        alert("Selecione pelo menos um equipamento com quantidade válida.");
        return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/locacoes/', locacaoFinal);
      navigate('/locacoes');
    } catch (error) {
      console.error("Erro ao criar locação:", error.response?.data);
      alert(`Erro ao criar locação: ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, mx: 'auto', my: 6, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, textAlign: 'center', color: 'primary.main', letterSpacing: 1 }}>
        Registrar Nova Locação
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
        <SelecaoEquipamentos itensSelecionados={formData.itens} onSelecaoChange={handleItensChange} />
      </FormControl>
      <TextField name="valor_total" label="Valor Total" type="number" value={formData.valor_total} onChange={handleFormChange} InputProps={{ inputProps: { step: '0.01' } }} required fullWidth sx={{ mb: 2 }} />
      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1, width: '100%' }}>Salvar Locação</Button>
    </Box>
  );
}
export default NovaLocacao;