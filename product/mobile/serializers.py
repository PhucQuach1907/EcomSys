from rest_framework import serializers

from .models import Mobile, Producer, Type


class MobileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mobile
        fields = '__all__'


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class ProducerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producer
        fields = '__all__'
