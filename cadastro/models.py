from django.db import models
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from .middleware import get_current_user, get_client_ip, get_user_agent


# ==========================
# 🔹 MODELOS PRINCIPAIS
# ==========================

class Cliente(models.Model):
    nome_razao = models.CharField("Nome/Razão Social", max_length=200)
    tipo_pessoa = models.CharField(
        max_length=10,
        choices=[("F", "Pessoa Física"), ("J", "Pessoa Jurídica")],
        default="F",
    )
    cpf_cnpj = models.CharField("CPF/CNPJ", max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.TextField("Endereço", blank=True, null=True)

    def __str__(self):
        return f"{self.nome_razao} ({self.cpf_cnpj})"


class Equipamento(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    quantidade_total = models.PositiveIntegerField(default=0)
    quantidade_disponivel = models.PositiveIntegerField(default=0)
    preco_unitario = models.DecimalField(
        "Preço Unitário", max_digits=10, decimal_places=2, default=0
    )

    def __str__(self):
        return f"{self.nome} ({self.quantidade_disponivel}/{self.quantidade_total})"


class Locacao(models.Model):
    STATUS_CHOICES = [
        ("Aberta", "Aberta"),
        ("Finalizada", "Finalizada"),
        ("Cancelada", "Cancelada"),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    data_inicio = models.DateField()
    data_fim = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Aberta")
    criado_em = models.DateTimeField(auto_now_add=True)
    valor_total = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, editable=False
    )

    def calcular_total(self):
        return sum(item.valor_total for item in self.itens.all())

    def save(self, *args, **kwargs):
        # Verifica mudança de status
        if self.pk:
            antigo = Locacao.objects.get(pk=self.pk)
            if antigo.status != self.status and self.status in ["Finalizada", "Cancelada"]:
                # Devolve estoque de todos os itens
                for item in self.itens.all():
                    item.equipamento.quantidade_disponivel += item.quantidade
                    item.equipamento.save()

        super().save(*args, **kwargs)

        # Atualiza valor total
        novo_total = self.calcular_total()
        if self.valor_total != novo_total:
            self.valor_total = novo_total
            super().save(update_fields=["valor_total"])

    def __str__(self):
        return f"Locação #{self.id} - {self.cliente.nome_razao}"


class ItemLocacao(models.Model):
    locacao = models.ForeignKey(
        Locacao, on_delete=models.CASCADE, related_name="itens"
    )
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_total = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, editable=False
    )

    def save(self, *args, **kwargs):
        if not self.valor_unitario and self.equipamento:
            self.valor_unitario = self.equipamento.preco_unitario

        self.valor_total = self.quantidade * self.valor_unitario

        if not self.pk:  # Novo item
            if self.equipamento.quantidade_disponivel < self.quantidade:
                raise ValidationError("Estoque insuficiente para criar o item de locação.")
            self.equipamento.quantidade_disponivel -= self.quantidade
            self.equipamento.save()

        super().save(*args, **kwargs)

        if self.locacao:
            self.locacao.valor_total = self.locacao.calcular_total()
            self.locacao.save(update_fields=["valor_total"])

    def __str__(self):
        return f"{self.equipamento.nome} x {self.quantidade}"


# ==========================
# 🔹 AUDITORIA
# ==========================

class AuditLog(models.Model):
    usuario = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    acao = models.CharField(max_length=20)  # CREATE, UPDATE, DELETE
    modelo = models.CharField(max_length=100)
    representacao = models.CharField(max_length=255, null=True, blank=True)
    alteracoes = models.TextField(null=True, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    data = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            user = get_current_user()
            if user and user.is_authenticated:
                self.usuario = user
            self.ip = get_client_ip()
            self.user_agent = get_user_agent()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.data}] {self.acao} - {self.modelo}"


# ==========================
# 🔹 SINAIS PARA ESTOQUE
# ==========================

@receiver(pre_save, sender=ItemLocacao)
def ajustar_estoque_alteracao(sender, instance, **kwargs):
    if instance.pk:
        antigo = ItemLocacao.objects.get(pk=instance.pk)
        diff = instance.quantidade - antigo.quantidade
        if diff != 0:
            if diff > 0 and instance.equipamento.quantidade_disponivel < diff:
                raise ValidationError("Estoque insuficiente para aumentar a quantidade.")
            instance.equipamento.quantidade_disponivel -= diff
            instance.equipamento.save()


@receiver(post_delete, sender=ItemLocacao)
def devolver_estoque(sender, instance, **kwargs):
    instance.equipamento.quantidade_disponivel += instance.quantidade
    instance.equipamento.save()


# ==========================
# 🔹 SINAIS DE AUDITORIA
# ==========================

def criar_auditlog(acao, instance, alteracoes=None):
    AuditLog.objects.create(
        acao=acao,
        modelo=instance.__class__.__name__,
        representacao=str(instance),
        alteracoes=alteracoes or "",
    )


@receiver(post_save, sender=Cliente)
def log_cliente(sender, instance, created, **kwargs):
    criar_auditlog("CREATE" if created else "UPDATE", instance)


@receiver(post_delete, sender=Cliente)
def log_cliente_delete(sender, instance, **kwargs):
    criar_auditlog("DELETE", instance)


@receiver(post_save, sender=Equipamento)
def log_equipamento(sender, instance, created, **kwargs):
    criar_auditlog("CREATE" if created else "UPDATE", instance)


@receiver(post_delete, sender=Equipamento)
def log_equipamento_delete(sender, instance, **kwargs):
    criar_auditlog("DELETE", instance)


@receiver(post_save, sender=Locacao)
def log_locacao(sender, instance, created, **kwargs):
    criar_auditlog("CREATE" if created else "UPDATE", instance)


@receiver(post_delete, sender=Locacao)
def log_locacao_delete(sender, instance, **kwargs):
    criar_auditlog("DELETE", instance)


@receiver(post_save, sender=ItemLocacao)
def log_itemlocacao(sender, instance, created, **kwargs):
    criar_auditlog("CREATE" if created else "UPDATE", instance)


@receiver(post_delete, sender=ItemLocacao)
def log_itemlocacao_delete(sender, instance, **kwargs):
    criar_auditlog("DELETE", instance)
