from django.db import transaction
from django.db.models import F, ProtectedError
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from .models import Equipamento, Cliente, Locacao, ItemLocacao, Pagamento
from .serializers import (
    EquipamentoSerializer, 
    ClienteSerializer, 
    LocacaoReadSerializer,
    LocacaoWriteSerializer,
    PagamentoSerializer
)

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    search_fields = ['nome', 'marca', 'modelo']

    def destroy(self, request, *args, **kwargs):
        equipamento = self.get_object()
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            locacoes_relacionadas = Locacao.objects.filter(equipamentos=equipamento)
            nomes_clientes = ", ".join(set([loc.cliente.nome for loc in locacoes_relacionadas]))
            mensagem = f"Não é possível apagar '{equipamento.nome}', pois ele está em uso na(s) locação(ões) do(s) cliente(s): {nomes_clientes}."
            return Response({"detail": mensagem}, status=status.HTTP_400_BAD_REQUEST)

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    search_fields = ['nome', 'email', 'telefone']

    def destroy(self, request, *args, **kwargs):
        cliente = self.get_object()
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            datas_locacoes = ", ".join(set([loc.data_locacao.strftime('%d/%m/%Y') for loc in cliente.locacao_set.all()]))
            mensagem = f"Não é possível apagar '{cliente.nome}', pois ele possui locação(ões) com data(s) de início em: {datas_locacoes}."
            return Response({"detail": mensagem}, status=status.HTTP_400_BAD_REQUEST)

class LocacaoViewSet(viewsets.ModelViewSet):
    queryset = Locacao.objects.all().prefetch_related('itens__equipamento', 'cliente')
    filterset_fields = ['cliente', 'data_locacao', 'devolvido', 'status']
    search_fields = ['cliente__nome', 'itens__equipamento__nome']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LocacaoWriteSerializer
        return LocacaoReadSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        itens_data = self.request.data.get('itens', [])
        for item_data in itens_data:
            equipamento = Equipamento.objects.select_for_update().get(pk=item_data['equipamento_id'])
            if item_data['quantidade'] > equipamento.quantidade_disponivel:
                raise serializers.ValidationError({"detail": f"Estoque de '{equipamento.nome}' insuficiente."})
        locacao = serializer.save()
        for item_data in itens_data:
            equipamento = Equipamento.objects.get(pk=item_data['equipamento_id'])
            ItemLocacao.objects.create(locacao=locacao, equipamento=equipamento, quantidade=item_data['quantidade'])
            equipamento.quantidade_disponivel = F('quantidade_disponivel') - item_data['quantidade']
            equipamento.save()

    @transaction.atomic
    def perform_update(self, serializer):
        locacao = self.get_object()
        itens_data = self.request.data.get('itens', [])
        
        # Devolve o estoque dos itens antigos para as prateleiras
        for item in locacao.itens.all():
            item.equipamento.quantidade_disponivel = F('quantidade_disponivel') + item.quantidade
            item.equipamento.save()
        
        # Valida o novo pedido de estoque (recarregando os dados do equipamento)
        for item_data in itens_data:
            equipamento = Equipamento.objects.get(pk=item_data['equipamento_id'])
            equipamento.refresh_from_db() 
            if item_data['quantidade'] > equipamento.quantidade_disponivel:
                raise serializers.ValidationError({"detail": f"Estoque insuficiente para '{equipamento.nome}'."})
        
        # Apaga os itens antigos da relação e salva as novas informações da locação
        locacao.itens.clear()
        locacao = serializer.save()
        
        # Cria os novos itens e deduz o novo estoque
        for item_data in itens_data:
            equipamento = Equipamento.objects.get(pk=item_data['equipamento_id'])
            ItemLocacao.objects.create(locacao=locacao, equipamento=equipamento, quantidade=item_data['quantidade'])
            equipamento.quantidade_disponivel = F('quantidade_disponivel') - item_data['quantidade']
            equipamento.save()

    @transaction.atomic
    def perform_destroy(self, instance):
        for item in instance.itens.all():
            item.equipamento.quantidade_disponivel = F('quantidade_disponivel') + item.quantidade
            item.equipamento.save()
        instance.delete()

class PagamentoViewSet(viewsets.ModelViewSet):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer
    filterset_fields = ['locacao', 'data_pagamento']