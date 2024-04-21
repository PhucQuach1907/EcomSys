import numpy as np
from PIL import Image
from extract_features import *
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import *


class ClothesViewSet(viewsets.ModelViewSet):
    queryset = Clothes.objects.all().order_by('name')
    serializer_class = ClothesSerializer

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.features_list = extract_features_clothes()

    @action(detail=True, methods=['get'])
    def search_clothes(self, request, pk=None):
        query = request.query_params.get('query', None)
        if query:
            clothes = Clothes.objects.filter(name__icontains=query).order_by('name')
            serializer = ClothesSerializer(clothes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def search_clothes_by_image(self, request, pk=None):
        uploaded_image = request.FILES['image']
        searched_image = Image.open(uploaded_image)
        query_features = extract_features(searched_image)
        threshold = 100

        matched_clothes = []
        for i, features in enumerate(self.features_list):
            distance = np.linalg.norm(query_features - features)
            if distance < threshold:
                matched_clothes.append(Clothes.objects.all()[i])

        serializer = ClothesSerializer(matched_clothes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClothesTypesViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
