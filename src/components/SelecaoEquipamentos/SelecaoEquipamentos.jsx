import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SelecaoEquipamentos.css';

function SelecaoEquipamentos({ itensSelecionados, onSelecaoChange, isEditMode = false }) {
  const [todosEquipamentos, setTodosEquipamentos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/equipamentos/');
        setTodosEquipamentos(response.data);
      } catch (error) { console.error("Erro ao buscar equipamentos:", error); }
    };
    fetchEquipamentos();
  }, []);

  const equipamentosFiltrados = todosEquipamentos.filter(e =>
    e.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleQuantidadeChange = (equipamento, quantidadeStr) => {
    const quantidade = parseInt(quantidadeStr, 10);
    const novaQuantidade = isNaN(quantidade) ? '' : Math.max(1, quantidade);
    
    const itemSendoEditado = itensSelecionados.find(item => item.equipamento_id === equipamento.id);
    const qtdJaReservada = itemSendoEditado ? itemSendoEditado.quantidade : 0;
    
    // LÓGICA DE ESTOQUE CORRETA E FINAL
    const estoqueMaximo = isEditMode 
      ? (equipamento.quantidade_disponivel + qtdJaReservada) 
      : equipamento.quantidade_disponivel;

    if (novaQuantidade > estoqueMaximo) {
      setErros({ ...erros, [equipamento.id]: `Máximo: ${estoqueMaximo}` });
      return;
    }
    
    const novosErros = { ...erros };
    delete novosErros[equipamento.id];
    setErros(novosErros);

    onSelecaoChange(
      itensSelecionados.map(item =>
        item.equipamento_id === equipamento.id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const handleSelecao = (equipamento, selecionado) => {
    if (selecionado) {
      onSelecaoChange([...itensSelecionados, { equipamento_id: equipamento.id, quantidade: 1 }]);
    } else {
      onSelecaoChange(itensSelecionados.filter(item => item.equipamento_id !== equipamento.id));
    }
  };

  return (
    <div className="selecao-container">
      <input type="text" placeholder="Buscar equipamento..." className="busca-equipamento" value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} />
      <div className="lista-selecao">
        {equipamentosFiltrados.map(equipamento => {
          const selecionado = itensSelecionados.some(item => item.equipamento_id === equipamento.id);
          const itemAtual = itensSelecionados.find(item => item.equipamento_id === equipamento.id);
          
          const qtdJaReservada = selecionado ? itemAtual.quantidade : 0;
          const estoqueMaximo = isEditMode ? (equipamento.quantidade_disponivel + qtdJaReservada) : equipamento.quantidade_disponivel;
          const isDisabled = equipamento.quantidade_disponivel <= 0 && !selecionado;

          return (
            <div key={equipamento.id} className={`item-selecao-wrapper ${isDisabled ? 'disabled' : ''}`}>
              <div className="item-selecao">
                <input type="checkbox" checked={selecionado} disabled={isDisabled} onChange={(e) => handleSelecao(equipamento, e.target.checked)} id={`equip-${equipamento.id}`} />
                <label htmlFor={`equip-${equipamento.id}`}>
                  {equipamento.nome} - <small>Disponível: {equipamento.quantidade_disponivel}</small>
                </label>
                {selecionado && (
                  <input type="number" className={`input-quantidade ${erros[equipamento.id] ? 'input-erro' : ''}`} min="1" max={estoqueMaximo} value={itemAtual?.quantidade || ''} onChange={(e) => handleQuantidadeChange(equipamento, e.target.value)} required placeholder="Qtd."/>
                )}
              </div>
              {erros[equipamento.id] && <small className="mensagem-erro">{erros[equipamento.id]}</small>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SelecaoEquipamentos;