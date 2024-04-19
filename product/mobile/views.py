from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import *


class MobileViewSet(viewsets.ModelViewSet):
    queryset = Mobile.objects.all().order_by('name')
    serializer_class = MobileSerializer

    @action(detail=True, methods=['get'])
    def search_mobiles(self, request, pk=None):
        query = request.query_params.get('query', None)
        if query:
            mobiles = Mobile.objects.filter(name__icontains=query).order_by('name')
            serializer = MobileSerializer(mobiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)


class MobileTypeViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
