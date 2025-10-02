from django.contrib import admin
from .models import Equipamento

@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "quantidade_total", "quantidade_disponivel", "preco_unitario")
    search_fields = ("nome",)
    list_filter = ("criado_em",)
    ordering = ("nome",)
