from django.db import models
from clientes.models import Cliente
from estoque.models import Equipamento

class Locacao(models.Model):
    STATUS_CHOICES = (
        ("aberta", "Aberta"),
        ("finalizada", "Finalizada"),
        ("cancelada", "Cancelada"),
    )

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    status = models.CharField("Status", max_length=20, choices=STATUS_CHOICES, default="aberta")
    valor_total = models.DecimalField("Valor Total", max_digits=10, decimal_places=2, default=0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Locação {self.id} - {self.cliente.nome_razao}"


class ItemLocacao(models.Model):
    locacao = models.ForeignKey(Locacao, on_delete=models.CASCADE, related_name="itens")
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField("Quantidade")
    valor_total = models.DecimalField("Valor Total", max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.equipamento.nome} (x{self.quantidade})"
