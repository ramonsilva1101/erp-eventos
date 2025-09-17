from django.db import models

# Create your models here.

class Equipamento(models.Model):
    nome = models.CharField(max_length=100, help_text="Nome ou descrição do equipamento")
    marca = models.CharField(max_length=50, blank=True)
    modelo = models.CharField(max_length=50, blank=True)
    quantidade_total = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.nome} ({self.marca} {self.modelo})"

class Cliente(models.Model):
    nome = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=100, unique=True)
    endereco = models.CharField(max_length=255, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nome

class Locacao(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, verbose_name="Cliente")
    equipamentos = models.ManyToManyField(Equipamento)
    data_locacao = models.DateField(verbose_name="Data da Locação")
    data_devolucao = models.DateField(verbose_name="Data da Devolução")
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Total")
    entregue = models.BooleanField(default=False, verbose_name="Material Entregue")
    devolvido = models.BooleanField(default=False, verbose_name="Material Devolvido")

    class Meta:
        verbose_name = "Locação"
        verbose_name_plural = "Locações"

    def __str__(self):
        # Formata a data para o padrão brasileiro DD/MM/YYYY
        data_formatada = self.data_locacao.strftime('%d/%m/%Y')
        return f"Locação de {self.cliente.nome} em {data_formatada}"