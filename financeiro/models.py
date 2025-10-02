from django.db import models
from eventos.models import Locacao

class Pagamento(models.Model):
    FORMA_PAGAMENTO_CHOICES = (
        ("dinheiro", "Dinheiro"),
        ("cartao", "Cartão"),
        ("pix", "Pix"),
        ("boleto", "Boleto"),
    )

    STATUS_CHOICES = (
        ("pendente", "Pendente"),
        ("pago", "Pago"),
        ("atrasado", "Atrasado"),
        ("cancelado", "Cancelado"),
    )

    locacao = models.ForeignKey(Locacao, on_delete=models.CASCADE, related_name="pagamentos")
    valor = models.DecimalField("Valor", max_digits=10, decimal_places=2)
    data_pagamento = models.DateField(blank=True, null=True)
    forma_pagamento = models.CharField("Forma de Pagamento", max_length=20, choices=FORMA_PAGAMENTO_CHOICES)
    status = models.CharField("Status", max_length=20, choices=STATUS_CHOICES, default="pendente")
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pagamento {self.id} - {self.locacao} ({self.status})"
