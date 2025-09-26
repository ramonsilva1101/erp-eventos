from rest_framework import serializers
from .models import Cliente, Equipamento, Locacao, ItemLocacao


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = "__all__"


class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = "__all__"


class ItemLocacaoSerializer(serializers.ModelSerializer):
    equipamento = serializers.PrimaryKeyRelatedField(
        queryset=Equipamento.objects.filter(quantidade_disponivel__gt=0)  # <- CORRIGIDO
    )

    class Meta:
        model = ItemLocacao
        fields = "__all__"
        read_only_fields = ("id",)


class LocacaoSerializer(serializers.ModelSerializer):
    itens = ItemLocacaoSerializer(many=True, read_only=True)

    class Meta:
        model = Locacao
        fields = "__all__"
