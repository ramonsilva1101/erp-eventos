from rest_framework import serializers
from .models import Equipamento, Cliente, Locacao

class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = '__all__' # Isso diz para traduzir todos os campos do modelo