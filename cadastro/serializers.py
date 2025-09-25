from rest_framework import serializers
from django.db import transaction
from .models import Cliente, Equipamento, Locacao, ItemLocacao, AuditLog


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = "__all__"


class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = "__all__"


class ItemLocacaoSerializer(serializers.ModelSerializer):
    equipamento_nome = serializers.ReadOnlyField(source="equipamento.nome")

    class Meta:
        model = ItemLocacao
        fields = ["id", "equipamento", "equipamento_nome", "quantidade"]


class LocacaoSerializer(serializers.ModelSerializer):
    itens = ItemLocacaoSerializer(many=True, read_only=True)
    cliente_nome = serializers.ReadOnlyField(source="cliente.nome")

    class Meta:
        model = Locacao
        fields = ["id", "cliente", "cliente_nome", "data_inicio", "data_fim", "status", "itens"]


class LocacaoCreateSerializer(serializers.ModelSerializer):
    itens = ItemLocacaoSerializer(many=True)

    class Meta:
        model = Locacao
        fields = ["id", "cliente", "data_inicio", "data_fim", "status", "itens"]

    @transaction.atomic
    def create(self, validated_data):
        itens_data = validated_data.pop("itens")
        locacao = Locacao.objects.create(**validated_data)

        for item in itens_data:
            equipamento = item["equipamento"]
            quantidade = item["quantidade"]

            # baixa no estoque
            equipamento.quantidade_estoque -= quantidade
            equipamento.save()

            ItemLocacao.objects.create(locacao=locacao, equipamento=equipamento, quantidade=quantidade)

        AuditLog.objects.create(
            acao="criado",
            modelo="Locacao",
            objeto_id=locacao.id,
        )
        return locacao
