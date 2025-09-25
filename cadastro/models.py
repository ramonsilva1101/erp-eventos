from django.db import models
from django.contrib.auth.models import User
from .current_user import get_current_user


class Cliente(models.Model):
    nome = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome


class Equipamento(models.Model):
    nome = models.CharField(max_length=150)
    descricao = models.TextField(blank=True, null=True)
    quantidade = models.PositiveIntegerField(default=0)
    ativo = models.BooleanField(default=True)
    precisa_manutencao = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nome} ({self.quantidade} un.)"


class Locacao(models.Model):
    STATUS_CHOICES = [
        ("aberta", "Aberta"),
        ("finalizada", "Finalizada"),
        ("cancelada", "Cancelada"),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="locacoes")
    equipamentos = models.ManyToManyField(Equipamento, through="ItemLocacao")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="aberta")
    data_locacao = models.DateField(auto_now_add=True)
    data_devolucao = models.DateField(blank=True, null=True)
    valor_final = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Locação {self.id} - {self.cliente.nome}"


class ItemLocacao(models.Model):
    locacao = models.ForeignKey(Locacao, on_delete=models.CASCADE)
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantidade}x {self.equipamento.nome} (Locação {self.locacao.id})"


class AuditLog(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    acao = models.CharField(max_length=50)  # criado, atualizado, deletado
    modelo = models.CharField(max_length=100)
    objeto_id = models.PositiveIntegerField()
    alteracoes = models.TextField(blank=True, null=True)
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.acao} em {self.modelo} ({self.objeto_id}) por {self.usuario}"
