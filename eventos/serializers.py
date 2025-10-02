from rest_framework import serializers
from .models import Locacao, ItemLocacao

class ItemLocacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemLocacao
        fields = '__all__'

class LocacaoSerializer(serializers.ModelSerializer):
    itens = ItemLocacaoSerializer(many=True, read_only=True)

    class Meta:
        model = Locacao
        fields = '__all__'
