# estoque/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum

from .models import Equipamento
from .serializers import EquipamentoSerializer
from usuarios.permissions import RoleBasedPermission, GROUP_ADMIN, GROUP_ESTOQUISTA, GROUP_VISUALIZADOR


class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all().order_by("nome")
    serializer_class = EquipamentoSerializer
    permission_classes = [RoleBasedPermission]
    group_permissions = {
        "create": [GROUP_ESTOQUISTA, GROUP_ADMIN],
        "update": [GROUP_ESTOQUISTA, GROUP_ADMIN],
        "partial_update": [GROUP_ESTOQUISTA, GROUP_ADMIN],
        "destroy": [GROUP_ADMIN],
        "list": [GROUP_VISUALIZADOR, GROUP_ESTOQUISTA, GROUP_ADMIN],
        "retrieve": [GROUP_VISUALIZADOR, GROUP_ESTOQUISTA, GROUP_ADMIN],
    }

    @action(detail=False, methods=["get"])
    def mais_alugados(self, request):
        """Ranking de equipamentos mais alugados"""
        from eventos.models import ItemLocacao

        data = (
            ItemLocacao.objects.values("equipamento__id", "equipamento__nome")
            .annotate(total_usado=Sum("quantidade"))
            .order_by("-total_usado")[:10]
        )
        return Response(data)
