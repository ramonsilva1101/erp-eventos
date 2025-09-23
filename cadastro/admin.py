from django.contrib import admin
from django import forms
from django.db import transaction
from .models import Equipamento, Cliente, Locacao, ItemLocacao, Pagamento

class ItemLocacaoFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        solicitado = {}
        for form in self.forms:
            if not form.is_valid() or form in self.deleted_forms:
                continue
            equipamento = form.cleaned_data.get('equipamento')
            quantidade = form.cleaned_data.get('quantidade')
            if equipamento and quantidade:
                solicitado[equipamento] = solicitado.get(equipamento, 0) + quantidade
        
        for equipamento, qtd_solicitada in solicitado.items():
            qtd_ja_reservada = 0
            if self.instance.pk:
                item_existente = self.instance.itens.filter(equipamento=equipamento).first()
                if item_existente:
                    qtd_ja_reservada = item_existente.quantidade
            estoque_maximo = equipamento.quantidade_disponivel + qtd_ja_reservada
            if qtd_solicitada > estoque_maximo:
                raise forms.ValidationError(
                    f"Estoque insuficiente para '{equipamento.nome}'. "
                    f"Solicitado: {qtd_solicitada}, Máximo permitido: {estoque_maximo}"
                )

class ItemLocacaoInline(admin.TabularInline):
    model = ItemLocacao
    formset = ItemLocacaoFormSet
    extra = 1

class EquipamentoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'marca', 'modelo', 'quantidade_total', 'quantidade_disponivel')
    search_fields = ('nome', 'marca', 'modelo')

class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'telefone', 'data_criacao')
    search_fields = ('nome', 'email')

class LocacaoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'data_locacao', 'data_devolucao', 'status', 'valor_total', 'devolvido')
    list_filter = ('status', 'devolvido', 'data_locacao')
    search_fields = ('cliente__nome',)
    inlines = [ItemLocacaoInline]

    def save_formset(self, request, form, formset, change):
        with transaction.atomic():
            instances = formset.save(commit=False)
            for obj in formset.deleted_objects:
                obj.equipamento.quantidade_disponivel += obj.quantidade
                obj.equipamento.save()
            for instance in instances:
                qtd_antiga = 0
                if instance.pk:
                    qtd_antiga = ItemLocacao.objects.get(pk=instance.pk).quantidade
                diferenca = instance.quantidade - qtd_antiga
                instance.equipamento.quantidade_disponivel -= diferenca
                instance.equipamento.save()
                instance.save()
            formset.save_m2m()

    def delete_queryset(self, request, queryset):
        with transaction.atomic():
            for locacao in queryset:
                for item in locacao.itens.all():
                    item.equipamento.quantidade_disponivel += item.quantidade
                    item.equipamento.save()
            queryset.delete()

admin.site.register(Pagamento)
admin.site.register(Equipamento, EquipamentoAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Locacao, LocacaoAdmin)