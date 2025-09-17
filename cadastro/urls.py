from rest_framework import routers
from .views import EquipamentoViewSet

router = routers.DefaultRouter()
router.register(r'equipamentos', EquipamentoViewSet)

urlpatterns = router.urls