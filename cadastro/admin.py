from django.contrib import admin
from .models import Cliente, Equipamento, Locacao, ItemLocacao, AuditLog


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "email", "telefone", "ativo", "created_at")
    list_filter = ("ativo", "created_at")
    search_fields = ("nome", "email", "telefone")


@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "descricao", "quantidade", "ativo", "precisa_manutencao")
    list_filter = ("ativo", "precisa_manutencao")
    search_fields = ("nome", "descricao")


@admin.register(Locacao)
class LocacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "cliente", "status", "data_locacao", "data_devolucao", "valor_final")
    list_filter = ("status", "data_locacao", "data_devolucao")
    search_fields = ("cliente__nome",)


@admin.register(ItemLocacao)
class ItemLocacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "locacao", "equipamento", "quantidade")
    search_fields = ("locacao__id", "equipamento__nome")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "acao", "modelo", "objeto_id", "data")
    list_filter = ("acao", "modelo", "data")
    search_fields = ("usuario__username", "modelo", "objeto_id", "alteracoes")
