from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, EquipamentoViewSet, LocacaoViewSet

router = DefaultRouter()
router.register(r"clientes", ClienteViewSet)
router.register(r"equipamentos", EquipamentoViewSet)
router.register(r"locacoes", LocacaoViewSet)

urlpatterns = router.urls
