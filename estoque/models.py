from django.db import models

class Equipamento(models.Model):
    nome = models.CharField("Nome", max_length=255)
    descricao = models.TextField("Descrição", blank=True, null=True)
    quantidade_total = models.PositiveIntegerField("Quantidade Total")
    quantidade_disponivel = models.PositiveIntegerField("Quantidade Disponível")
    preco_unitario = models.DecimalField("Preço Unitário", max_digits=10, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome
