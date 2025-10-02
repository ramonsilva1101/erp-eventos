from rest_framework.routers import DefaultRouter
from .views import LocacaoViewSet, ItemLocacaoViewSet

router = DefaultRouter()
router.register(r'locacoes', LocacaoViewSet, basename='locacao')
router.register(r'itens-locacao', ItemLocacaoViewSet, basename='itemlocacao')

urlpatterns = router.urls
