"""
Rotas do app cadastro
"""

from django.urls import path, include
from rest_framework import routers
from .views import ClienteViewSet, EquipamentoViewSet, LocacaoViewSet, ItemLocacaoViewSet

router = routers.DefaultRouter()
router.register(r"clientes", ClienteViewSet)
router.register(r"equipamentos", EquipamentoViewSet)
router.register(r"locacoes", LocacaoViewSet)
router.register(r"itens", ItemLocacaoViewSet)

urlpatterns = [
    path("", include(router.urls)),  # Apenas as rotas da API do DRF
]
