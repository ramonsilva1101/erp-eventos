from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Cliente, Equipamento, Locacao, ItemLocacao, AuditLog
from .current_user import get_current_user


def registrar_auditlog(acao, instance, alteracoes=None):
    """
    Cria um registro no AuditLog.
    - acao: 'criado', 'atualizado', 'deletado'
    - instance: objeto que sofreu a ação
    - alteracoes: dicionário com os dados modificados
    """
    AuditLog.objects.create(
        usuario=str(get_current_user() or "system"),
        acao=acao,
        modelo=instance.__class__.__name__,
        objeto_id=instance.pk if instance.pk else None,
        alteracoes=alteracoes or {"representacao": str(instance)},
    )


# ==========================
# CLIENTE
# ==========================
@receiver(post_save, sender=Cliente)
def log_cliente_save(sender, instance, created, **kwargs):
    if created:
        registrar_auditlog("criado", instance, {"representacao": str(instance)})
    else:
        registrar_auditlog("atualizado", instance, {"representacao": str(instance)})


@receiver(post_delete, sender=Cliente)
def log_cliente_delete(sender, instance, **kwargs):
    registrar_auditlog("deletado", instance, {"representacao": str(instance)})


# ==========================
# EQUIPAMENTO
# ==========================
@receiver(post_save, sender=Equipamento)
def log_equipamento_save(sender, instance, created, **kwargs):
    if created:
        registrar_auditlog("criado", instance, {"representacao": str(instance)})
    else:
        registrar_auditlog("atualizado", instance, {"representacao": str(instance)})


@receiver(post_delete, sender=Equipamento)
def log_equipamento_delete(sender, instance, **kwargs):
    registrar_auditlog("deletado", instance, {"representacao": str(instance)})


# ==========================
# LOCAÇÃO
# ==========================
@receiver(post_save, sender=Locacao)
def log_locacao_save(sender, instance, created, **kwargs):
    if created:
        registrar_auditlog("criado", instance, {"representacao": str(instance)})
    else:
        registrar_auditlog("atualizado", instance, {"representacao": str(instance)})


@receiver(post_delete, sender=Locacao)
def log_locacao_delete(sender, instance, **kwargs):
    registrar_auditlog("deletado", instance, {"representacao": str(instance)})


# ==========================
# ITEM DE LOCAÇÃO
# ==========================
@receiver(post_save, sender=ItemLocacao)
def log_itemlocacao_save(sender, instance, created, **kwargs):
    if created:
        registrar_auditlog("criado", instance, {"representacao": str(instance)})
    else:
        registrar_auditlog("atualizado", instance, {"representacao": str(instance)})


@receiver(post_delete, sender=ItemLocacao)
def log_itemlocacao_delete(sender, instance, **kwargs):
    registrar_auditlog("deletado", instance, {"representacao": str(instance)})
