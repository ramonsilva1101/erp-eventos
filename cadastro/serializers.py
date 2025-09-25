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
    equipamento_nome = serializers.CharField(source="equipamento.nome", read_only=True)
    valor_unitario = serializers.DecimalField(
        source="equipamento.valor_diaria", max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = ItemLocacao
        fields = ["id", "equipamento", "equipamento_nome", "valor_unitario", "quantidade"]


class LocacaoSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source="cliente.nome", read_only=True)
    itens = ItemLocacaoSerializer(many=True)

    class Meta:
        model = Locacao
        fields = [
            "id",
            "cliente",
            "cliente_nome",
            "data_locacao",
            "data_devolucao",
            "status",
            "valor_total",
            "itens",
        ]
        read_only_fields = ["valor_total"]

    def create(self, validated_data):
        itens_data = validated_data.pop("itens", [])
        locacao = Locacao.objects.create(**validated_data)
        for item_data in itens_data:
            ItemLocacao.objects.create(locacao=locacao, **item_data)
        locacao.valor_total = locacao.calcular_valor_total()
        locacao.save()
        return locacao

    def update(self, instance, validated_data):
        itens_data = validated_data.pop("itens", [])
        instance.cliente = validated_data.get("cliente", instance.cliente)
        instance.data_locacao = validated_data.get("data_locacao", instance.data_locacao)
        instance.data_devolucao = validated_data.get("data_devolucao", instance.data_devolucao)
        instance.status = validated_data.get("status", instance.status)
        instance.save()

        # Atualiza itens
        instance.itens.all().delete()
        for item_data in itens_data:
            ItemLocacao.objects.create(locacao=instance, **item_data)

        instance.valor_total = instance.calcular_valor_total()
        instance.save()
        return instance
