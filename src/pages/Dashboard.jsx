import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Importando componentes MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PeopleIcon from '@mui/icons-material/People';
import SpeakerGroupIcon from '@mui/icons-material/SpeakerGroup';
import EventNoteIcon from '@mui/icons-material/EventNote';

function DashboardPage() {
  // 1. Criamos "memórias" (states) para guardar nossos números e o estado de carregamento
  const [stats, setStats] = useState({
    totalEquipamentos: 0,
    totalClientes: 0,
    locacoesAtivas: 0,
  });
  const [loading, setLoading] = useState(true);

  // 2. Usamos o "gatilho" useEffect para buscar os dados quando a página carrega
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 3. Fazemos as 3 chamadas à API em paralelo para mais eficiência
        const [equipamentosRes, clientesRes, locacoesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/equipamentos/'),
          axios.get('http://127.0.0.1:8000/api/clientes/'),
          axios.get('http://127.0.0.1:8000/api/locacoes/?devolvido=false'), // Usando o filtro que já criamos!
        ]);

        // 4. Atualizamos nossa "memória" com os totais
        setStats({
          totalEquipamentos: equipamentosRes.data.length,
          totalClientes: clientesRes.data.length,
          locacoesAtivas: locacoesRes.data.length,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false); // 5. Dizemos que o carregamento terminou
      }
    };

    fetchStats();
  }, []); // O [] vazio garante que isso roda só uma vez

  // Um componente interno para nossos cards de estatística
  const StatCard = ({ icon, title, value, linkTo, color }) => (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      {icon}
      <Typography variant="h3" component="h2" sx={{ my: 2, fontWeight: 'bold' }}>
        {loading ? <CircularProgress size={48} /> : value}
      </Typography>
      <Typography color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
        {title}
      </Typography>
      <Button component={Link} to={linkTo} variant="outlined" color={color}>
        Gerenciar
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Principal
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Visão geral do negócio em tempo real.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<SpeakerGroupIcon sx={{ fontSize: 60 }} color="primary" />}
            title="Equipamentos Cadastrados"
            value={stats.totalEquipamentos}
            linkTo="/equipamentos"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<PeopleIcon sx={{ fontSize: 60 }} color="secondary" />}
            title="Clientes Ativos"
            value={stats.totalClientes}
            linkTo="/clientes"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<EventNoteIcon sx={{ fontSize: 60 }} color="success" />}
            title="Locações Ativas"
            value={stats.locacoesAtivas}
            linkTo="/locacoes"
            color="success"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;