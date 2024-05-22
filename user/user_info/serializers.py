from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
import re
from rest_framework import serializers
from .models import User, Account, Fullname, Address


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[\d]', value):
            raise ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?\\|`~]', value):
            raise ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['password'] = self.validate_password(password)
        account = Account(**validated_data)
        account.set_password(password)
        account.save()
        return account

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            validated_data['password'] = self.validate_password(password)
            instance.set_password(password)
        return super().update(instance, validated_data)


class FullnameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fullname
        fields = ['first_name', 'last_name']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['noHouse', 'street', 'district', 'city', 'country']


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    fullname = FullnameSerializer()
    address = AddressSerializer()

    class Meta:
        model = User
        fields = ['id', 'email', 'account', 'fullname', 'address', 'is_active', 'is_staff', 'is_manager', 'is_delivery_office']
        extra_kwargs = {'is_active': {'read_only': True}}

    def create(self, validated_data):
        account_data = validated_data.pop('account')
        fullname_data = validated_data.pop('fullname', None)
        address_data = validated_data.pop('address', None)

        account = AccountSerializer.create(AccountSerializer(), validated_data=account_data)
        fullname = Fullname.objects.create(**fullname_data) if fullname_data else None
        address = Address.objects.create(**address_data) if address_data else None

        user = User.objects.create(account=account, fullname=fullname, address=address, **validated_data)
        return user

    def update(self, instance, validated_data):
        account_data = validated_data.pop('account', None)
        fullname_data = validated_data.pop('fullname', None)
        address_data = validated_data.pop('address', None)

        if account_data:
            account = instance.account
            if 'password' in account_data:
                account_data['password'] = make_password(account_data['password'])
            AccountSerializer.update(AccountSerializer(), instance=account, validated_data=account_data)

        if fullname_data:
            if instance.fullname:
                FullnameSerializer.update(FullnameSerializer(), instance=instance.fullname,
                                          validated_data=fullname_data)
            else:
                instance.fullname = Fullname.objects.create(**fullname_data)

        if address_data:
            if instance.address:
                AddressSerializer.update(AddressSerializer(), instance=instance.address, validated_data=address_data)
            else:
                instance.address = Address.objects.create(**address_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
