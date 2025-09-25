from django.db import models
from django.utils import timezone


class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nome


class Equipamento(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    valor_diaria = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nome


class Locacao(models.Model):
    STATUS_CHOICES = [
        ("aberta", "Aberta"),
        ("finalizada", "Finalizada"),
        ("cancelada", "Cancelada"),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="locacoes")
    data_locacao = models.DateField(default=timezone.now)
    data_devolucao = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="aberta")
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calcular_valor_total(self):
        dias = (self.data_devolucao - self.data_locacao).days if self.data_devolucao else 1
        if dias < 1:
            dias = 1
        total = sum(
            item.quantidade * item.equipamento.valor_diaria * dias
            for item in self.itens.all()
        )
        return total

    def atualizar_valor_total(self):
        self.valor_total = self.calcular_valor_total()
        super().save(update_fields=["valor_total"])

    def save(self, *args, **kwargs):
        if self.pk:
            old = Locacao.objects.get(pk=self.pk)
            if old.status != self.status and self.status in ["finalizada", "cancelada"]:
                # devolve os equipamentos ao estoque somente ao mudar status
                for item in self.itens.all():
                    item.equipamento.quantidade += item.quantidade
                    item.equipamento.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Locação de {self.cliente.nome} ({self.data_locacao})"


class ItemLocacao(models.Model):
    locacao = models.ForeignKey(Locacao, on_delete=models.CASCADE, related_name="itens")
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.pk:
            item_antigo = ItemLocacao.objects.get(pk=self.pk)
            diferenca = self.quantidade - item_antigo.quantidade

            if diferenca > 0:  # alugando mais
                if self.equipamento.quantidade >= diferenca:
                    self.equipamento.quantidade -= diferenca
                else:
                    raise ValueError("Quantidade em estoque insuficiente.")
            elif diferenca < 0:  # devolvendo parte
                self.equipamento.quantidade += abs(diferenca)

            self.equipamento.save()
        else:
            # criação de novo item
            if self.equipamento.quantidade >= self.quantidade:
                self.equipamento.quantidade -= self.quantidade
                self.equipamento.save()
            else:
                raise ValueError("Quantidade em estoque insuficiente.")

        super().save(*args, **kwargs)
        self.locacao.atualizar_valor_total()

    def delete(self, *args, **kwargs):
        # devolve estoque ao excluir item
        self.equipamento.quantidade += self.quantidade
        self.equipamento.save()

        super().delete(*args, **kwargs)
        self.locacao.atualizar_valor_total()

    def __str__(self):
        return f"{self.quantidade}x {self.equipamento.nome} (Locação {self.locacao.id})"
