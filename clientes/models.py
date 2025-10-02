from django.db import models

class Cliente(models.Model):
    TIPO_PESSOA_CHOICES = (
        ("F", "Pessoa Física"),
        ("J", "Pessoa Jurídica"),
    )

    nome_razao = models.CharField("Nome / Razão Social", max_length=255)
    cpf_cnpj = models.CharField("CPF / CNPJ", max_length=20, unique=True)
    tipo_pessoa = models.CharField("Tipo de Pessoa", max_length=1, choices=TIPO_PESSOA_CHOICES)
    telefone = models.CharField("Telefone", max_length=20, blank=True, null=True)
    email = models.EmailField("E-mail", blank=True, null=True)
    endereco = models.TextField("Endereço", blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome_razao} ({self.cpf_cnpj})"
