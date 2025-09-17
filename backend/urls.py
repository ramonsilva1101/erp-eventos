from django.contrib import admin
from django.urls import path, include # Verifique se 'include' está aqui na importação

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('cadastro.urls')), # E principalmente, verifique se ESTA linha foi adicionada
]