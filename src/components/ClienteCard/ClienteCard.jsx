import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function ClienteCard({ cliente, onDelete }) {
  const handleDelete = async () => {
    const confirmar = window.confirm(`Tem certeza que deseja apagar o cliente "${cliente.nome}"?`);
    if (confirmar) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/clientes/${cliente.id}/`);
        onDelete(cliente.id);
      } catch (error) {
        let msg = "Não foi possível apagar o cliente.";
        if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        }
        alert(msg);
      }
    }
  };

  return (
    <Card sx={{ width: 300, margin: 2, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">{cliente.nome}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>E-mail: {cliente.email || 'N/A'}</Typography>
        <Typography variant="body2" color="text.secondary">Telefone: {cliente.telefone || 'N/A'}</Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/clientes/${cliente.id}/editar`} size="small">Editar</Button>
        <Button onClick={handleDelete} size="small" color="error">Apagar</Button>
      </CardActions>
    </Card>
  );
}

export default ClienteCard;