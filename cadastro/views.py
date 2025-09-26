# backend/cadastro/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cliente, Equipamento, Locacao, ItemLocacao
from .serializers import ClienteSerializer, EquipamentoSerializer, LocacaoSerializer, ItemLocacaoSerializer
from django.db import transaction

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        marca = self.request.query_params.get("marca")
        modelo = self.request.query_params.get("modelo")
        if marca:
            qs = qs.filter(marca__icontains=marca)
        if modelo:
            qs = qs.filter(modelo__icontains=modelo)
        return qs

class LocacaoViewSet(viewsets.ModelViewSet):
    queryset = Locacao.objects.all()
    serializer_class = LocacaoSerializer

    @action(detail=True, methods=["post"])
    def mudar_status(self, request, pk=None):
        loc = self.get_object()
        novo_status = request.data.get("status")
        if novo_status not in dict(Locacao.STATUS_CHOICES).keys():
            return Response({"detail": "status inválido"}, status=status.HTTP_400_BAD_REQUEST)

        # lógica simples: se mudar para finalizada/cancelada e ainda não devolveu estoque -> devolver
        if novo_status in (Locacao.STATUS_FINALIZADA, Locacao.STATUS_CANCELADA) and not loc.estoque_devolvido:
            with transaction.atomic():
                for item in loc.itens.all():
                    item.equipamento.quantidade += item.quantidade
                    item.equipamento.save()
                loc.estoque_devolvido = True
                loc.status = novo_status
                loc.save()
        elif novo_status == Locacao.STATUS_ABERTA and loc.estoque_devolvido:
            # voltar a baixar estoque (voltar para "aberta")
            with transaction.atomic():
                for item in loc.itens.all():
                    if item.equipamento.quantidade < item.quantidade:
                        return Response({"detail": f"Estoque insuficiente para equipamento {item.equipamento.nome}"}, status=status.HTTP_400_BAD_REQUEST)
                for item in loc.itens.all():
                    item.equipamento.quantidade -= item.quantidade
                    item.equipamento.save()
                loc.estoque_devolvido = False
                loc.status = novo_status
                loc.save()
        else:
            loc.status = novo_status
            loc.save()

        return Response(self.get_serializer(loc).data)

class ItemLocacaoViewSet(viewsets.ModelViewSet):
    queryset = ItemLocacao.objects.all()
    serializer_class = ItemLocacaoSerializer
