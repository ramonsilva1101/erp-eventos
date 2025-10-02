# financeiro/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Pagamento
from .serializers import PagamentoSerializer
from usuarios.permissions import RoleBasedPermission, GROUP_ADMIN, GROUP_ATENDENTE, GROUP_VISUALIZADOR


class PagamentoViewSet(viewsets.ModelViewSet):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer
    permission_classes = [RoleBasedPermission]
    group_permissions = {
        "create": [GROUP_ATENDENTE, GROUP_ADMIN],
        "update": [GROUP_ATENDENTE, GROUP_ADMIN],
        "partial_update": [GROUP_ATENDENTE, GROUP_ADMIN],
        "destroy": [GROUP_ADMIN],
        "list": [GROUP_VISUALIZADOR, GROUP_ATENDENTE, GROUP_ADMIN],
        "retrieve": [GROUP_VISUALIZADOR, GROUP_ATENDENTE, GROUP_ADMIN],
    }

    @action(detail=False, methods=["get"])
    def pendentes(self, request):
        """Lista pagamentos ainda não quitados"""
        data = Pagamento.objects.filter(status="Pendente").values(
            "id", "locacao__id", "valor", "forma_pagamento", "status"
        )
        return Response(data)
