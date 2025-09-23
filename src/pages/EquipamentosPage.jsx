import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EquipamentoCard from '../components/EquipamentoCard/EquipamentoCard.jsx';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/equipamentos/', {
          params: { search: termoBusca }
        });
        setEquipamentos(response.data);
      } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
      }
    };
    fetchEquipamentos();
  }, [termoBusca]);

  const handleEquipamentoDelete = (idDoEquipamentoApagado) => {
    setEquipamentos(equipamentos.filter(equip => equip.id !== idDoEquipamentoApagado));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Lista de Equipamentos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Buscar por nome, marca ou modelo"
            variant="outlined"
            size="small"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button component={Link} to="/equipamentos/novo" variant="contained" color="primary">
            Adicionar Novo
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {equipamentos.map(equipamento => (
          <EquipamentoCard 
            key={equipamento.id} 
            equipamento={equipamento}
            onDelete={handleEquipamentoDelete} 
          />
        ))}
      </Box>
    </Box>
  );
}

export default EquipamentosPage;