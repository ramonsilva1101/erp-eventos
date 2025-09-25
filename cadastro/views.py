from rest_framework import viewsets
from .models import Cliente, Equipamento, Locacao
from .serializers import ClienteSerializer, EquipamentoSerializer, LocacaoSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer


class LocacaoViewSet(viewsets.ModelViewSet):
    queryset = Locacao.objects.all().prefetch_related("itens__equipamento")
    serializer_class = LocacaoSerializer
