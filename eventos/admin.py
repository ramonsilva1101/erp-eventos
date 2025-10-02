from django.contrib import admin
from .models import Locacao, ItemLocacao

@admin.register(Locacao)
class LocacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "cliente", "data_inicio", "data_fim", "status", "valor_total")
    search_fields = ("cliente__nome_razao",)
    list_filter = ("status", "data_inicio", "data_fim")
    ordering = ("-data_inicio",)


@admin.register(ItemLocacao)
class ItemLocacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "locacao", "equipamento", "quantidade", "valor_total")
    search_fields = ("equipamento__nome", "locacao__cliente__nome_razao")
    list_filter = ("equipamento",)
