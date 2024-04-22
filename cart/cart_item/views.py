from django.shortcuts import render
from rest_framework import viewsets

from .models import CartItem
from .serializers import CartItemSerializer


# Create your views here.
class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all().order_by('date_added')
    serializer_class = CartItemSerializer
