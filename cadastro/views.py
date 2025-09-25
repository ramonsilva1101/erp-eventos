from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Cliente, Equipamento, Locacao, ItemLocacao
from .serializers import (
    ClienteSerializer,
    EquipamentoSerializer,
    LocacaoSerializer,
    LocacaoCreateSerializer,
    ItemLocacaoSerializer,
)


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["marca", "modelo", "nome"]


class LocacaoViewSet(viewsets.ModelViewSet):
    queryset = Locacao.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return LocacaoCreateSerializer
        return LocacaoSerializer


class ItemLocacaoViewSet(viewsets.ModelViewSet):
    queryset = ItemLocacao.objects.all()
    serializer_class = ItemLocacaoSerializer
