import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Importando os componentes do MUI para o formulário
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function NovoEquipamento() {
  const navigate = useNavigate();
  // A lógica de state e de envio continua a mesma
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const novoEquipamento = {
      nome: nome,
      marca: marca,
      modelo: modelo,
      quantidade_total: quantidade,
      quantidade_disponivel: quantidade, // Inicializa disponível igual ao total
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/equipamentos/', novoEquipamento);
      navigate('/equipamentos');
    } catch (error) {
      console.error("Erro ao criar equipamento:", error);
    }
  };

  return (
    // 2. Usamos o componente <Box> do MUI como container do formulário
    // A propriedade 'sx' nos permite adicionar estilos diretamente
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Adiciona um espaçamento de 2 unidades (16px) entre cada item
        maxWidth: '500px',
        margin: '40px auto', // Centraliza o formulário na tela
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Cadastrar Novo Equipamento
      </Typography>

      {/* 3. Substituímos <input> por <TextField> do MUI */}
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
        InputProps={{ inputProps: { min: 1 } }} // Define o valor mínimo
      />
      
      {/* 4. Substituímos <button> por <Button> do MUI */}
      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
        Salvar
      </Button>
    </Box>
  );
}

export default NovoEquipamento;