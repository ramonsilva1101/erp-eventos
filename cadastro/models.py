from django.db import models

class Equipamento(models.Model):
    nome = models.CharField(max_length=100)
    marca = models.CharField(max_length=50, blank=True)
    modelo = models.CharField(max_length=50, blank=True)
    quantidade_total = models.PositiveIntegerField(default=1)
    quantidade_disponivel = models.PositiveIntegerField(editable=False, default=0)

    def __str__(self):
        return f"{self.nome} ({self.marca or 'N/A'})"

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.quantidade_disponivel = self.quantidade_total
        else:
            original = Equipamento.objects.get(pk=self.pk)
            diferenca = self.quantidade_total - original.quantidade_total
            self.quantidade_disponivel = max(0, int(self.quantidade_disponivel) + diferenca)
        super().save(*args, **kwargs)

class Cliente(models.Model):
    nome = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=100, unique=True)
    endereco = models.CharField(max_length=255, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nome

class Locacao(models.Model):
    STATUS_CHOICES = [
        ('ORC', 'Orçamento'),
        ('CONF', 'Confirmada'),
        ('FIN', 'Finalizada'),
        ('CANC', 'Cancelada'),
    ]
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT)
    equipamentos = models.ManyToManyField(Equipamento, through='ItemLocacao')
    data_locacao = models.DateField()
    data_devolucao = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=4, choices=STATUS_CHOICES, default='ORC')
    entregue = models.BooleanField(default=False)
    devolvido = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Locação"
        verbose_name_plural = "Locações"

    def __str__(self):
        return f"Locação de {self.cliente.nome} em {self.data_locacao.strftime('%d/%m/%Y')}"

class ItemLocacao(models.Model):
    locacao = models.ForeignKey(Locacao, on_delete=models.CASCADE, related_name='itens')
    equipamento = models.ForeignKey(Equipamento, on_delete=models.PROTECT)
    quantidade = models.PositiveIntegerField()

    class Meta:
        unique_together = ('locacao', 'equipamento')

class Pagamento(models.Model):
    locacao = models.ForeignKey(Locacao, on_delete=models.CASCADE, related_name='pagamentos')
    data_pagamento = models.DateField()
    valor_pago = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pagamento = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Pagamento de R$ {self.valor_pago} para a locação {self.locacao.id}"