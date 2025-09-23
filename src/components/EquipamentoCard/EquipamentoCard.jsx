import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function EquipamentoCard({ equipamento, onDelete }) {
  const handleDelete = async () => {
    const confirmar = window.confirm(`Tem certeza que deseja apagar o equipamento "${equipamento.nome}"?`);
    if (confirmar) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/equipamentos/${equipamento.id}/`);
        onDelete(equipamento.id);
      } catch (error) {
        let mensagemErro = "Não foi possível apagar o equipamento.";
        if (error.response?.data?.detail) {
          mensagemErro = error.response.data.detail;
        }
        alert(mensagemErro);
      }
    }
  };

  return (
    <Card sx={{ width: 300, margin: 2, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          {equipamento.nome}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {equipamento.marca || 'Marca não informada'}
        </Typography>
        <Typography variant="body2">
          Modelo: {equipamento.modelo || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
          Disponível: {equipamento.quantidade_disponivel} / {equipamento.quantidade_total}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/equipamentos/${equipamento.id}/editar`} size="small">Editar</Button>
        <Button onClick={handleDelete} size="small" color="error">Apagar</Button>
      </CardActions>
    </Card>
  );
}

export default EquipamentoCard;