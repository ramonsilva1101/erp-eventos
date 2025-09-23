from rest_framework import serializers
from .models import Equipamento, Cliente, Locacao, ItemLocacao, Pagamento

class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class ItemLocacaoReadSerializer(serializers.ModelSerializer):
    equipamento = EquipamentoSerializer(read_only=True)
    class Meta:
        model = ItemLocacao
        fields = ['equipamento', 'quantidade']

class LocacaoReadSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    itens = ItemLocacaoReadSerializer(source='itens', many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    quantidade_total_itens = serializers.SerializerMethodField()

    class Meta:
        model = Locacao
        fields = ['id', 'cliente', 'data_locacao', 'data_devolucao', 'valor_total', 'quantidade_total_itens', 'entregue', 'devolvido', 'status', 'status_display', 'itens']

    def get_quantidade_total_itens(self, obj):
        return sum(item.quantidade for item in obj.itens.all())

class ItemLocacaoWriteSerializer(serializers.Serializer):
    equipamento_id = serializers.IntegerField()
    quantidade = serializers.IntegerField(min_value=1)

class LocacaoWriteSerializer(serializers.ModelSerializer):
    itens = ItemLocacaoWriteSerializer(many=True, write_only=True)
    class Meta:
        model = Locacao
        fields = ['cliente', 'data_locacao', 'data_devolucao', 'valor_total', 'status', 'itens']

class PagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagamento
        fields = '__all__'