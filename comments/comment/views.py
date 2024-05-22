from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        product_type = self.kwargs.get('product_type')
        product_id = self.kwargs.get('product_id')
        if product_type is not None and product_id is not None:
            return Comment.objects.filter(product_id=product_id, product_type=product_type)
        return Comment.objects.all().order_by('-id')
