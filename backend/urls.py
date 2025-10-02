from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Importar os ViewSets
from clientes.views import ClienteViewSet
from estoque.views import EquipamentoViewSet
from eventos.views import LocacaoViewSet, ItemLocacaoViewSet
from financeiro.views import PagamentoViewSet

router = DefaultRouter()
router.register(r"clientes", ClienteViewSet)
router.register(r"estoque", EquipamentoViewSet)
router.register(r"locacoes", LocacaoViewSet)
router.register(r"itens-locacao", ItemLocacaoViewSet)
router.register(r"pagamentos", PagamentoViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),

    # API endpoints
    path("api/", include(router.urls)),

    # Rota de usuário logado
    path("api/usuarios/", include("usuarios.urls")),

    # Autenticação JWT
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
