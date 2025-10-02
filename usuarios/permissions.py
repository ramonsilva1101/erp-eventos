# usuarios/permissions.py
from typing import Iterable
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group

GROUP_ADMIN = "Admin"
GROUP_ATENDENTE = "Atendente"
GROUP_ESTOQUISTA = "Estoquista"
GROUP_VISUALIZADOR = "Visualizador"


def _user_in_groups(user, groups: Iterable[str]) -> bool:
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    return user.groups.filter(name__in=list(groups)).exists()


class RoleBasedPermission(BasePermission):
    """
    Permissão baseada em grupos de usuário para ViewSets do DRF.
    """

    def has_permission(self, request, view) -> bool:
        group_permissions = getattr(view, "group_permissions", None)
        if not group_permissions:
            return request.user.is_authenticated

        action = getattr(view, "action", None) or request.method.lower()
        allowed_groups = group_permissions.get(action)

        if allowed_groups is None:
            return request.user.is_authenticated

        return _user_in_groups(request.user, allowed_groups)

    def has_object_permission(self, request, view, obj) -> bool:
        return self.has_permission(request, view)
