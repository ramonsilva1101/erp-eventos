import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function LocacoesPage() {
  const [locacoes, setLocacoes] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    const fetchLocacoes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/locacoes/', { params: { search: termoBusca } });
        setLocacoes(response.data);
      } catch (error) { console.error("Erro ao buscar locações:", error); }
    };
    fetchLocacoes();
  }, [termoBusca]);

  const handleDelete = async (locacaoId) => {
    if (window.confirm(`Tem certeza? O estoque será devolvido.`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/locacoes/${locacaoId}/`);
        setLocacoes(locacoes.filter(l => l.id !== locacaoId));
      } catch (error) { alert("Erro ao apagar."); }
    }
  };
  
  const getStatusClass = (status) => status ? `status-${status.toLowerCase().replace('ç', 'c').replace('ã', 'a')}` : '';

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Lista de Locações</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Buscar" variant="outlined" size="small" value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} />
          <Button component={Link} to="/locacoes/novo" variant="contained">Adicionar Nova</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Qtd. Itens</TableCell>
              <TableCell>Data da Locação</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locacoes.map((loc) => (
              <TableRow key={loc.id} hover>
                <TableCell>{loc.cliente?.nome || 'N/A'}</TableCell>
                <TableCell>{`${loc.quantidade_total_itens || 0} itens`}</TableCell>
                <TableCell>{format(parseISO(loc.data_locacao), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <span className={`status-badge ${getStatusClass(loc.status_display)}`}>{loc.status_display}</span>
                </TableCell>
                <TableCell>{`R$ ${loc.valor_total}`}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar"><IconButton component={Link} to={`/locacoes/${loc.id}/editar`} color="secondary"><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Apagar"><IconButton onClick={() => handleDelete(loc.id)} color="error"><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
export default LocacoesPage;