# usuarios/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    """
    Modelo de usuário customizado baseado no AbstractUser.
    Pode ser expandido depois (ex: cargo, telefone, etc.).
    """
    # Exemplo: campo opcional de telefone
    telefone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username
