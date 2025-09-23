from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView # 1. Importamos a ferramenta de redirecionamento

urlpatterns = [
    # 2. Esta nova linha diz: "Se alguém chegar na raiz (''), redirecione para a API"
    path('', RedirectView.as_view(url='/api/', permanent=False)),

    path('admin/', admin.site.urls),
    path('api/', include('cadastro.urls')),
]