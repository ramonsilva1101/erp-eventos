from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "nome_razao", "tipo_pessoa", "cpf_cnpj", "telefone", "email")
    search_fields = ("nome_razao", "cpf_cnpj", "email")
    list_filter = ("tipo_pessoa",)
    ordering = ("nome_razao",)
