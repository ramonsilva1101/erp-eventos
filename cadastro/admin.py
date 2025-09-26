from django.contrib import admin
from .models import Cliente, Equipamento, Locacao, ItemLocacao, AuditLog


# ==========================
# 🔹 CLIENTE
# ==========================
@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("nome_razao", "tipo_pessoa", "cpf_cnpj", "email", "telefone")
    search_fields = ("nome_razao", "cpf_cnpj", "email")
    list_filter = ("tipo_pessoa",)


# ==========================
# 🔹 EQUIPAMENTO
# ==========================
@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    list_display = ("nome", "quantidade_total", "quantidade_disponivel", "preco_unitario")
    search_fields = ("nome",)
    list_filter = ()  # retiramos "marca" e "modelo" porque não existem mais


# ==========================
# 🔹 ITEM DE LOCAÇÃO
# ==========================
class ItemLocacaoInline(admin.TabularInline):
    model = ItemLocacao
    extra = 1


# ==========================
# 🔹 LOCAÇÃO
# ==========================
@admin.register(Locacao)
class LocacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "cliente", "data_inicio", "data_fim", "status", "valor_total")
    list_filter = ("status", "data_inicio", "data_fim")
    search_fields = ("cliente__nome_razao", "cliente__cpf_cnpj")
    inlines = [ItemLocacaoInline]
    readonly_fields = ("valor_total",)  # só esse precisa ser readonly


# ==========================
# 🔹 AUDITORIA
# ==========================
@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("data", "acao", "modelo", "representacao", "usuario", "ip")
    readonly_fields = ("usuario", "acao", "modelo", "representacao",
                       "alteracoes", "ip", "user_agent", "data")
    search_fields = ("modelo", "representacao", "usuario__username")
    list_filter = ("acao", "modelo", "data")
