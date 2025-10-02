# clientes/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count

from .models import Cliente
from .serializers import ClienteSerializer
from usuarios.permissions import RoleBasedPermission, GROUP_ADMIN, GROUP_ATENDENTE, GROUP_VISUALIZADOR


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
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
    def top(self, request):
        """Retorna os clientes com mais locações"""
        data = (
            Cliente.objects.annotate(total_locacoes=Count("locacao"))
            .order_by("-total_locacoes")[:10]
            .values("id", "nome", "total_locacoes")
        )
        return Response(data)
