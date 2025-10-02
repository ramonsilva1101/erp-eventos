# usuarios/management/commands/create_roles.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = "Cria grupos padrão e atribui permissões básicas."

    def handle(self, *args, **options):
        groups_spec = {
            "Admin": {"all": True},
            "Atendente": {"models": {"cliente": ["add", "change", "view"], "locacao": ["add", "change", "view"], "itemlocacao": ["add", "change", "view"]}},
            "Estoquista": {"models": {"equipamento": ["add", "change", "view"]}},
            "Visualizador": {"models": {"cliente": ["view"], "equipamento": ["view"], "locacao": ["view"]}},
        }

        created = []
        for group_name, spec in groups_spec.items():
            group, _ = Group.objects.get_or_create(name=group_name)
            created.append(group_name)

            if spec.get("all"):
                group.permissions.set(Permission.objects.all())
                self.stdout.write(f"Grupo '{group_name}': atribuído ALL perms.")
                continue

            for model_name, actions in spec.get("models", {}).items():
                for action in actions:
                    codename = f"{action}_{model_name}"
                    try:
                        perm = Permission.objects.get(codename=codename)
                        group.permissions.add(perm)
                        self.stdout.write(f"Adicionado perm {codename} -> {group_name}")
                    except Permission.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Permissão {codename} não existe."))

        self.stdout.write(self.style.SUCCESS("Grupos criados/atualizados: " + ", ".join(created)))
