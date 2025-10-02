# eventos/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count

from .models import Locacao, ItemLocacao
from .serializers import LocacaoSerializer, ItemLocacaoSerializer
from usuarios.permissions import RoleBasedPermission, GROUP_ADMIN, GROUP_ATENDENTE, GROUP_VISUALIZADOR


class LocacaoViewSet(viewsets.ModelViewSet):
    queryset = Locacao.objects.all().order_by("-criado_em")
    serializer_class = LocacaoSerializer
    permission_classes = [RoleBasedPermission]
    group_permissions = {
        "create": [GROUP_ATENDENTE, GROUP_ADMIN],
        "update": [GROUP_ATENDENTE, GROUP_ADMIN],
        "partial_update": [GROUP_ATENDENTE, GROUP_ADMIN],
        "destroy": [GROUP_ADMIN],
        "list": [GROUP_VISUALIZADOR, GROUP_ATENDENTE, GROUP_ADMIN],
        "retrieve": [GROUP_VISUALIZADOR, GROUP_ATENDENTE, GROUP_ADMIN],
    }

    @action(detail=True, methods=["post"])
    def finalizar(self, request, pk=None):
        """Finaliza uma locação"""
        locacao = self.get_object()
        locacao.status = "Finalizada"
        locacao.save()
        return Response({"status": "finalizada"})

    @action(detail=False, methods=["get"])
    def resumo(self, request):
        """Resumo: locações abertas e finalizadas"""
        data = Locacao.objects.values("status").annotate(total=Count("id"))
        return Response(data)


class ItemLocacaoViewSet(viewsets.ModelViewSet):
    queryset = ItemLocacao.objects.all()
    serializer_class = ItemLocacaoSerializer
    permission_classes = [RoleBasedPermission]
    group_permissions = {
        "create": [GROUP_ATENDENTE, GROUP_ADMIN],
        "update": [GROUP_ATENDENTE, GROUP_ADMIN],
        "partial_update": [GROUP_ATENDENTE, GROUP_ADMIN],
        "destroy": [GROUP_ADMIN],
        "list": [GROUP_VISUALIZADOR, GROUP_ATENDENTE, GROUP_ADMIN],
        "retrieve": [GROUP_VISUALIZADOR, GROUP_ATENDENTE, GROUP_ADMIN],
    }
