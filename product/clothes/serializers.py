from rest_framework import serializers

from .models import Clothes, Type


class ClothesSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='type.name', read_only=True)

    class Meta:
        model = Clothes
        fields = ['id', 'image', 'name', 'type', 'quantity', 'price']


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'
