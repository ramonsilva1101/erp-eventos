from django.contrib import admin
from .models import Equipamento, Cliente, Locacao # Importa os três modelos

class EquipamentoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'marca', 'modelo', 'quantidade_total')
    search_fields = ('nome', 'marca', 'modelo')

class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'telefone', 'data_criacao')
    search_fields = ('nome', 'email')

class LocacaoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'data_locacao', 'data_devolucao', 'valor_total', 'devolvido')
    search_fields = ('cliente__nome',)
    filter_horizontal = ('equipamentos',) # Super dica para campos ManyToMany!

# Registra cada modelo com sua respectiva classe de customização
admin.site.register(Equipamento, EquipamentoAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Locacao, LocacaoAdmin)