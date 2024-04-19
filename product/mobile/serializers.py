from rest_framework import serializers

from .models import Mobile, Type


class MobileSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='type.name', read_only=True)

    class Meta:
        model = Mobile
        fields = ['id', 'image', 'name', 'producer', 'type', 'quantity', 'price']


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'
