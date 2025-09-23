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
      try {
        const [locacaoResponse, clientesResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/locacoes/${locacaoId}/`),
          axios.get('http://127.0.0.1:8000/api/clientes/'),
        ]);
        
        const locacaoData = locacaoResponse.data;
        setFormData({
          cliente: locacaoData.cliente.id,
          status: locacaoData.status,
          data_locacao: format(parseISO(locacaoData.data_locacao), 'yyyy-MM-dd'),
          data_devolucao: format(parseISO(locacaoData.data_devolucao), 'yyyy-MM-dd'),
          valor_total: locacaoData.valor_total,
          itens: locacaoData.itens.map(item => ({
            equipamento_id: item.equipamento.id,
            quantidade: item.quantidade
          })),
        });
        setClientes(clientesResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados para edição:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locacaoId]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItensChange = (novosItens) => {
    setFormData(prev => ({ ...prev, itens: novosItens.filter(item => item.quantidade > 0) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const locacaoFinal = { ...formData, itens: formData.itens.filter(item => item.quantidade > 0) };

    if (locacaoFinal.itens.length === 0) {
        alert("Por favor, selecione pelo menos um equipamento com quantidade maior que zero.");
        return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/locacoes/${locacaoId}/`, locacaoFinal);
      navigate('/locacoes');
    } catch (error) {
      console.error("Erro ao atualizar locação:", error.response?.data);
      alert(`Erro ao atualizar locação: ${JSON.stringify(error.response?.data)}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '800px', margin: '40px auto', padding: '32px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 4 }}>Editar Locação</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <FormControl fullWidth required>
            <InputLabel>Cliente</InputLabel>
            <Select name="cliente" value={formData.cliente} label="Cliente" onChange={handleFormChange}>
              {clientes.map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>{cliente.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} label="Status" onChange={handleFormChange}>
              <MenuItem value="ORC">Orçamento</MenuItem>
              <MenuItem value="CONF">Confirmada</MenuItem>
              <MenuItem value="FIN">Finalizada</MenuItem>
              <MenuItem value="CANC">Cancelada</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555', mb: 1}}>Equipamentos:</Typography>
            <SelecaoEquipamentos 
              itensSelecionados={formData.itens} 
              onSelecaoChange={handleItensChange}
              isEditMode={true}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} container spacing={3}>
            <Grid item xs={12} sm={4}>
                <TextField name="data_locacao" label="Data da Locação" type="date" value={formData.data_locacao} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField name="data_devolucao" label="Data da Devolução" type="date" value={formData.data_devolucao} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField name="valor_total" label="Valor Total" type="number" value={formData.valor_total} onChange={handleFormChange} InputProps={{ inputProps: { step: "0.01" } }} required fullWidth/>
            </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>Salvar Alterações</Button>
        </Grid>
      </Grid>
    </Box>
  );
}
export default EditarLocacao;