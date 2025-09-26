from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Locacao, ItemLocacao

@receiver(post_save, sender=Locacao)
def ajustar_estoque_locacao(sender, instance, created, **kwargs):
    """
    Ajusta o estoque automaticamente quando a locação é finalizada ou cancelada.
    """
    if not created:  # só em updates
        if instance.status in ["Finalizada", "Cancelada"]:
            for item in instance.itens.all():
                equipamento = item.equipamento
                equipamento.quantidade_disponivel += item.quantidade
                equipamento.save()
