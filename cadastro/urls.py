from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ClienteViewSet, EquipamentoViewSet, LocacaoViewSet, ItemLocacaoViewSet

router = DefaultRouter()
router.register(r"clientes", ClienteViewSet, basename="cliente")
router.register(r"equipamentos", EquipamentoViewSet, basename="equipamento")
router.register(r"locacoes", LocacaoViewSet, basename="locacao")
router.register(r"itens-locacao", ItemLocacaoViewSet, basename="itemlocacao")

urlpatterns = [
    path("", include(router.urls)),
]
