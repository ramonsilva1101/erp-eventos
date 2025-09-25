from django.contrib import admin
from .models import Cliente, Equipamento, Locacao, ItemLocacao


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("nome", "telefone", "email")
    search_fields = ("nome", "email")


@admin.register(Equipamento)
class EquipamentoAdmin(admin.ModelAdmin):
    list_display = ("nome", "descricao", "valor_diaria", "quantidade")
    search_fields = ("nome",)
    list_filter = ("nome",)


class ItemLocacaoInline(admin.TabularInline):
    model = ItemLocacao
    extra = 1
    autocomplete_fields = ["equipamento"]


@admin.register(Locacao)
class LocacaoAdmin(admin.ModelAdmin):
    list_display = ("cliente", "data_locacao", "data_devolucao", "status", "valor_total")
    list_filter = ("status", "data_locacao", "data_devolucao")
    search_fields = ("cliente__nome",)
    inlines = [ItemLocacaoInline]

    # 🔒 deixa valor_total apenas leitura
    readonly_fields = ("valor_total",)

    def save_model(self, request, obj, form, change):
        """
        Garante que o valor_total seja recalculado
        quando a locação for salva no admin.
        """
        super().save_model(request, obj, form, change)
        obj.valor_total = obj.calcular_valor_total()
        obj.save(update_fields=["valor_total"])


@admin.register(ItemLocacao)
class ItemLocacaoAdmin(admin.ModelAdmin):
    list_display = ("locacao", "equipamento", "quantidade")
    list_filter = ("equipamento",)
    search_fields = ("equipamento__nome", "locacao__cliente__nome")
