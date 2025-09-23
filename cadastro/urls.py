from rest_framework import routers
from .views import EquipamentoViewSet, ClienteViewSet, LocacaoViewSet, PagamentoViewSet

router = routers.DefaultRouter()
router.register(r'equipamentos', EquipamentoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'locacoes', LocacaoViewSet)
router.register(r'pagamentos', PagamentoViewSet)

urlpatterns = router.urls