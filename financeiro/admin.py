from django.contrib import admin
from .models import Pagamento

@admin.register(Pagamento)
class PagamentoAdmin(admin.ModelAdmin):
    list_display = ("id", "locacao", "valor", "forma_pagamento", "status", "data_pagamento")
    search_fields = ("locacao__cliente__nome_razao",)
    list_filter = ("status", "forma_pagamento")
    ordering = ("-data_pagamento",)
